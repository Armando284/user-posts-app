import { describe, expect, it, vi } from 'vitest'
import { http, HttpResponse, delay } from 'msw'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { usersFixture } from '../test/fixtures'
import { renderWithQueryClient } from '../test/render'
import { server } from '../test/server'
import { UserDirectory } from './UserDirectory'

const API_URL = 'https://jsonplaceholder.typicode.com'

function renderUserDirectory() {
  return renderWithQueryClient(<UserDirectory selectedUserId={null} onSelectUser={() => {}} />)
}

describe('UserDirectory', () => {
  it('shows a loading state while users are being fetched', async () => {
    server.use(
      http.get(`${API_URL}/users`, async () => {
        await delay(100)
        return HttpResponse.json(usersFixture)
      }),
    )

    renderUserDirectory()

    expect(screen.getByRole('status')).toHaveTextContent('Loading users...')
    expect(await screen.findByText(usersFixture[0].name)).toBeInTheDocument()
  })

  it('renders the users returned by the API', async () => {
    renderUserDirectory()

    expect(await screen.findByText(usersFixture[0].name)).toBeInTheDocument()
    expect(screen.getByText(usersFixture[1].name)).toBeInTheDocument()
    expect(screen.getByText(usersFixture[2].name)).toBeInTheDocument()
  })

  it('shows a normalized error message when fetching users fails', async () => {
    server.use(http.get(`${API_URL}/users`, () => HttpResponse.json(null, { status: 500 })))

    renderUserDirectory()

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'The server encountered an error. Please try again later.',
    )
    expect(screen.queryByRole('list')).not.toBeInTheDocument()
  })

  it('retries loading users from the error state', async () => {
    let requestCount = 0
    server.use(
      http.get(`${API_URL}/users`, () => {
        requestCount += 1

        return requestCount === 1
          ? HttpResponse.json(null, { status: 500 })
          : HttpResponse.json(usersFixture)
      }),
    )

    const user = userEvent.setup()
    renderUserDirectory()

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'The server encountered an error. Please try again later.',
    )

    await user.click(screen.getByRole('button', { name: 'Try again' }))

    expect(await screen.findByText(usersFixture[0].name)).toBeInTheDocument()
  })

  it('filters users by name case-insensitively', async () => {
    const user = userEvent.setup()
    renderUserDirectory()

    await screen.findByText(usersFixture[0].name)
    await user.type(screen.getByLabelText('Search users'), 'ERVIN')

    expect(screen.getByText('Ervin Howell')).toBeInTheDocument()
    expect(screen.queryByText('Leanne Graham')).not.toBeInTheDocument()
    expect(screen.queryByText('Clementine Bauch')).not.toBeInTheDocument()
  })

  it('shows an empty state when no users match the search', async () => {
    const user = userEvent.setup()
    renderUserDirectory()

    await screen.findByText(usersFixture[0].name)
    await user.type(screen.getByLabelText('Search users'), 'nobody')

    expect(screen.getByRole('status')).toHaveTextContent('No users found.')
    expect(screen.queryByRole('list')).not.toBeInTheDocument()
  })

  it('does not request users again when searching', async () => {
    const usersRequest = vi.fn(() => HttpResponse.json(usersFixture))
    server.use(http.get(`${API_URL}/users`, usersRequest))

    const user = userEvent.setup()
    renderUserDirectory()

    await screen.findByText(usersFixture[0].name)
    expect(usersRequest).toHaveBeenCalledTimes(1)

    await user.type(screen.getByLabelText('Search users'), 'ervin')

    expect(screen.getByText('Ervin Howell')).toBeInTheDocument()
    expect(usersRequest).toHaveBeenCalledTimes(1)
  })
})
