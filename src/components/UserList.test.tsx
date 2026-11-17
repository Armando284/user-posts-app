import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { usersFixture } from '../test/fixtures'
import { UserList } from './UserList'

function renderUserList(
  selectedUserId: number | null = null,
  onSelectUser: (userId: number) => void = vi.fn(),
) {
  render(
    <UserList users={usersFixture} selectedUserId={selectedUserId} onSelectUser={onSelectUser} />,
  )

  return { onSelectUser }
}

describe('UserList', () => {
  it('renders an accessible list of users', () => {
    renderUserList()

    expect(screen.getByRole('list', { name: 'Users' })).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(usersFixture.length)
  })

  it('renders each user name and email', () => {
    renderUserList()

    for (const user of usersFixture) {
      expect(screen.getByText(user.name)).toBeInTheDocument()
      expect(screen.getByText(user.email)).toBeInTheDocument()
    }
  })

  it('marks the selected user', () => {
    renderUserList(2)

    expect(screen.getByRole('button', { name: /Ervin Howell/ })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(screen.getByRole('button', { name: /Leanne Graham/ })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
  })

  it('calls onSelectUser with the clicked user id', async () => {
    const user = userEvent.setup()
    const { onSelectUser } = renderUserList()

    await user.click(screen.getByRole('button', { name: /Clementine Bauch/ }))

    expect(onSelectUser).toHaveBeenCalledWith(3)
  })
})
