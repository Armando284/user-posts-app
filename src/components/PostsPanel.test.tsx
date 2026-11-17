import { describe, expect, it } from 'vitest'
import { delay, http, HttpResponse } from 'msw'
import { act, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { queryKeys } from '../lib/queryKeys'
import { postsFixture } from '../test/fixtures'
import { renderWithQueryClient } from '../test/render'
import { server } from '../test/server'
import type { Post } from '../types/post'
import { PostsPanel } from './PostsPanel'

const API_URL = 'https://jsonplaceholder.typicode.com'

describe('PostsPanel', () => {
  it('prompts the user to select a user when nothing is selected', () => {
    renderWithQueryClient(<PostsPanel selectedUserId={null} />)

    expect(screen.getByText('Select a user to view their posts.')).toBeInTheDocument()
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('shows a loading state while posts are being fetched', async () => {
    server.use(
      http.get(`${API_URL}/posts`, async () => {
        await delay(100)
        return HttpResponse.json(postsFixture.filter((post) => post.userId === 1))
      }),
    )

    renderWithQueryClient(<PostsPanel selectedUserId={1} />)

    expect(screen.getByRole('status')).toHaveTextContent('Loading posts...')
    expect(await screen.findByText('Leanne post one')).toBeInTheDocument()
  })

  it('renders the posts for the selected user', async () => {
    renderWithQueryClient(<PostsPanel selectedUserId={1} />)

    expect(await screen.findByText('Leanne post one')).toBeInTheDocument()
    expect(screen.getByText('Leanne post two')).toBeInTheDocument()
  })

  it('creates a post locally and updates the posts cache', async () => {
    const user = userEvent.setup()
    const { queryClient } = renderWithQueryClient(<PostsPanel selectedUserId={1} />)

    await screen.findByText('Leanne post one')

    await user.type(screen.getByLabelText('Title'), 'My new post')
    await user.type(screen.getByLabelText('Post content'), 'A locally created post')
    await user.click(screen.getByRole('button', { name: 'Create post' }))

    expect(await screen.findByText('My new post')).toBeInTheDocument()
    expect(screen.getByText('A locally created post')).toBeInTheDocument()
    expect(screen.getByText('Leanne post one')).toBeInTheDocument()
    expect(screen.getByText('Leanne post two')).toBeInTheDocument()

    const posts = queryClient.getQueryData<Post[]>(queryKeys.posts(1))
    expect(posts).toHaveLength(postsFixture.filter((post) => post.userId === 1).length + 1)
    expect(posts?.[0]).toMatchObject({
      userId: 1,
      title: 'My new post',
      body: 'A locally created post',
    })
    expect(posts?.[0]?.id).toBeLessThan(0)
    expect(screen.getByLabelText('Title')).toHaveValue('')
    expect(screen.getByLabelText('Post content')).toHaveValue('')
  })

  it('generates unique temporary ids for locally created posts', async () => {
    const user = userEvent.setup()
    const { queryClient } = renderWithQueryClient(<PostsPanel selectedUserId={1} />)

    await screen.findByText('Leanne post one')

    await user.type(screen.getByLabelText('Title'), 'First local post')
    await user.type(screen.getByLabelText('Post content'), 'First body')
    await user.click(screen.getByRole('button', { name: 'Create post' }))
    await screen.findByText('First local post')

    await user.type(screen.getByLabelText('Title'), 'Second local post')
    await user.type(screen.getByLabelText('Post content'), 'Second body')
    await user.click(screen.getByRole('button', { name: 'Create post' }))
    await screen.findByText('Second local post')

    const posts = queryClient.getQueryData<Post[]>(queryKeys.posts(1)) ?? []
    const localPostIds = posts.filter((post) => post.id < 0).map((post) => post.id)

    expect(localPostIds).toHaveLength(2)
    expect(new Set(localPostIds).size).toBe(2)
    expect(posts.filter((post) => post.id < 0).every((post) => post.userId === 1)).toBe(true)
  })

  it('keeps locally created posts when the posts query is refetched', async () => {
    const user = userEvent.setup()
    const { queryClient } = renderWithQueryClient(<PostsPanel selectedUserId={1} />)

    await screen.findByText('Leanne post one')

    await user.type(screen.getByLabelText('Title'), 'Post that survives refetch')
    await user.type(screen.getByLabelText('Post content'), 'Refetched body')
    await user.click(screen.getByRole('button', { name: 'Create post' }))
    await screen.findByText('Post that survives refetch')

    await act(async () => {
      await queryClient.refetchQueries({ queryKey: queryKeys.posts(1) })
    })

    expect(screen.getByText('Post that survives refetch')).toBeInTheDocument()
    expect(screen.getByText('Leanne post one')).toBeInTheDocument()
  })

  it('shows a normalized error message when fetching posts fails', async () => {
    server.use(http.get(`${API_URL}/posts`, () => HttpResponse.json(null, { status: 500 })))

    renderWithQueryClient(<PostsPanel selectedUserId={1} />)

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'The server encountered an error. Please try again later.',
    )
    expect(screen.queryByRole('list')).not.toBeInTheDocument()
  })

  it('retries loading posts from the error state', async () => {
    let requestCount = 0
    server.use(
      http.get(`${API_URL}/posts`, () => {
        requestCount += 1

        return requestCount === 1
          ? HttpResponse.json(null, { status: 500 })
          : HttpResponse.json(postsFixture.filter((post) => post.userId === 1))
      }),
    )

    const user = userEvent.setup()
    renderWithQueryClient(<PostsPanel selectedUserId={1} />)

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'The server encountered an error. Please try again later.',
    )

    await user.click(screen.getByRole('button', { name: 'Try again' }))

    expect(await screen.findByText('Leanne post one')).toBeInTheDocument()
    expect(requestCount).toBe(2)
  })

  it('shows an empty state when the selected user has no posts', async () => {
    renderWithQueryClient(<PostsPanel selectedUserId={3} />)

    expect(await screen.findByText('No posts found for this user.')).toBeInTheDocument()
    expect(screen.queryByRole('list')).not.toBeInTheDocument()
  })
})
