import { describe, expect, it } from 'vitest'
import { delay, http, HttpResponse } from 'msw'
import { screen } from '@testing-library/react'
import { postsFixture } from '../test/fixtures'
import { renderWithQueryClient } from '../test/render'
import { server } from '../test/server'
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

  it('shows a normalized error message when fetching posts fails', async () => {
    server.use(http.get(`${API_URL}/posts`, () => HttpResponse.json(null, { status: 500 })))

    renderWithQueryClient(<PostsPanel selectedUserId={1} />)

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'The server encountered an error. Please try again later.',
    )
    expect(screen.queryByRole('list')).not.toBeInTheDocument()
  })

  it('shows an empty state when the selected user has no posts', async () => {
    renderWithQueryClient(<PostsPanel selectedUserId={3} />)

    expect(await screen.findByText('No posts found for this user.')).toBeInTheDocument()
    expect(screen.queryByRole('list')).not.toBeInTheDocument()
  })
})
