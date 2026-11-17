import { describe, expect, it } from 'vitest'
import { http, HttpResponse } from 'msw'
import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { queryKeys } from './lib/queryKeys'
import { postsFixture, usersFixture } from './test/fixtures'
import { renderWithQueryClient } from './test/render'
import { server } from './test/server'
import type { Post } from './types/post'
import App from './App'

const API_URL = 'https://jsonplaceholder.typicode.com'

describe('App', () => {
  it('renders the application and user directory', async () => {
    renderWithQueryClient(<App />)

    expect(screen.getByRole('heading', { level: 1, name: 'User Posts' })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Users' })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Posts' })).toBeInTheDocument()
    expect(await screen.findByText(usersFixture[0].name)).toBeInTheDocument()
  })

  it('supports selecting a user with the keyboard', async () => {
    const user = userEvent.setup()
    renderWithQueryClient(<App />)

    const search = screen.getByLabelText('Search users')
    const leanne = await screen.findByRole('button', { name: /Leanne Graham/ })

    expect(leanne).toHaveAttribute('aria-controls', 'posts-panel')

    await user.tab()
    expect(search).toHaveFocus()

    await user.tab()
    expect(leanne).toHaveFocus()

    await user.keyboard('{Enter}')

    expect(await screen.findByText('Leanne post one')).toBeInTheDocument()
    expect(leanne).toHaveAttribute('aria-pressed', 'true')
  })

  it('fetches and displays posts when a user is selected', async () => {
    const user = userEvent.setup()
    renderWithQueryClient(<App />)

    const leanne = await screen.findByRole('button', { name: /Leanne Graham/ })
    await user.click(leanne)

    expect(await screen.findByText('Leanne post one')).toBeInTheDocument()
    expect(leanne).toHaveAttribute('aria-pressed', 'true')
  })

  it('filters users and preserves the selection when the search changes', async () => {
    const user = userEvent.setup()
    renderWithQueryClient(<App />)

    const search = screen.getByLabelText('Search users')
    const ervin = await screen.findByRole('button', { name: /Ervin Howell/ })

    await user.type(search, 'ervin')

    expect(screen.queryByRole('button', { name: /Leanne Graham/ })).not.toBeInTheDocument()

    await user.click(ervin)

    expect(await screen.findByText('Ervin post one')).toBeInTheDocument()
    expect(ervin).toHaveAttribute('aria-pressed', 'true')

    await user.clear(search)

    expect(screen.getByRole('button', { name: /Leanne Graham/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Ervin Howell/ })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(screen.getByText('Ervin post one')).toBeInTheDocument()
  })

  it('creates a post for the currently selected user after switching users', async () => {
    const user = userEvent.setup()
    const { queryClient } = renderWithQueryClient(<App />)

    await user.click(await screen.findByRole('button', { name: /Leanne Graham/ }))
    await screen.findByText('Leanne post one')

    await user.click(screen.getByRole('button', { name: /Ervin Howell/ }))
    await screen.findByText('Ervin post one')

    await user.type(screen.getByLabelText('Title'), 'Ervin-only post')
    await user.type(screen.getByLabelText('Post content'), 'Created after switching users.')
    await user.click(screen.getByRole('button', { name: 'Create post' }))

    expect(await screen.findByText('Ervin-only post')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /Leanne Graham/ }))
    await screen.findByText('Leanne post one')

    expect(
      within(screen.getByRole('list', { name: 'Posts' })).queryByText('Ervin-only post'),
    ).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /Ervin Howell/ }))
    expect(await screen.findByText('Ervin-only post')).toBeInTheDocument()

    const ervinPosts = queryClient.getQueryData<Post[]>(queryKeys.posts(2)) ?? []
    const leannePosts = queryClient.getQueryData<Post[]>(queryKeys.posts(1)) ?? []

    expect(ervinPosts.some((post) => post.title === 'Ervin-only post')).toBe(true)
    expect(leannePosts.some((post) => post.title === 'Ervin-only post')).toBe(false)
  })

  it('keeps a created post when switching between users', async () => {
    const user = userEvent.setup()
    renderWithQueryClient(<App />)

    await user.click(await screen.findByRole('button', { name: /Leanne Graham/ }))
    await screen.findByText('Leanne post one')

    await user.type(screen.getByLabelText('Title'), 'Session post')
    await user.type(screen.getByLabelText('Post content'), 'Created during the session')
    await user.click(screen.getByRole('button', { name: 'Create post' }))
    expect(await screen.findByText('Session post')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /Ervin Howell/ }))
    await screen.findByText('Ervin post one')

    await user.click(screen.getByRole('button', { name: /Leanne Graham/ }))

    expect(await screen.findByText('Session post')).toBeInTheDocument()
    expect(screen.getByText('Leanne post one')).toBeInTheDocument()
  })

  it('reuses cached posts when returning to a previously selected user', async () => {
    const requestedUserIds: string[] = []
    server.use(
      http.get(`${API_URL}/posts`, ({ request }) => {
        const userId = new URL(request.url).searchParams.get('userId')

        if (userId) {
          requestedUserIds.push(userId)
        }

        return HttpResponse.json(postsFixture.filter((post) => String(post.userId) === userId))
      }),
    )

    const user = userEvent.setup()
    renderWithQueryClient(<App />)

    await user.click(await screen.findByRole('button', { name: /Leanne Graham/ }))
    await screen.findByText('Leanne post one')

    await user.click(screen.getByRole('button', { name: /Ervin Howell/ }))
    await screen.findByText('Ervin post one')

    await user.click(screen.getByRole('button', { name: /Leanne Graham/ }))
    expect(await screen.findByText('Leanne post one')).toBeInTheDocument()

    expect(requestedUserIds.filter((userId) => userId === '1')).toHaveLength(1)
    expect(requestedUserIds.filter((userId) => userId === '2')).toHaveLength(1)
  })
})
