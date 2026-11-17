import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { usersFixture } from '../test/fixtures'
import { UserList } from './UserList'

describe('UserList', () => {
  it('renders an accessible list of users', () => {
    render(<UserList users={usersFixture} />)

    expect(screen.getByRole('list', { name: 'Users' })).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(usersFixture.length)
  })

  it('renders each user name and email', () => {
    render(<UserList users={usersFixture} />)

    for (const user of usersFixture) {
      expect(screen.getByText(user.name)).toBeInTheDocument()
      expect(screen.getByText(user.email)).toBeInTheDocument()
    }
  })
})
