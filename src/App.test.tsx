import { describe, expect, it } from 'vitest'
import { http, HttpResponse } from 'msw'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { postsFixture, usersFixture } from './test/fixtures'
import { renderWithQueryClient } from './test/render'
import { server } from './test/server'
import App from './App'

const API_URL = 'https://jsonplaceholder.typicode.com'

describe('App', () => {
  it('renders the application and user directory', async () => {
    renderWithQueryClient(<App />)

    expect(screen.getByRole('heading', { level: 1, name: 'User Posts' })).toBeInTheDocument()
    expect(await screen.findByText(usersFixture[0].name)).toBeInTheDocument()
  })

  it('fetches and displays posts when a user is selected', async () => {
    const user = userEvent.setup()
    renderWithQueryClient(<App />)

    const leanne = await screen.findByRole('button', { name: /Leanne Graham/ })
    await user.click(leanne)

    expect(await screen.findByText('Leanne post one')).toBeInTheDocument()
    expect(leanne).toHaveAttribute('aria-pressed', 'true')
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
