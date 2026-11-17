import { useMemo, useState } from 'react'
import { getErrorMessage } from '../api/client'
import { useUsers } from '../hooks/useUsers'
import type { User } from '../types/user'
import { UserList } from './UserList'
import { UserSearch } from './UserSearch'

interface UserDirectoryProps {
  selectedUserId: number | null
  onSelectUser: (userId: number) => void
}

function filterUsersByName(users: User[], searchTerm: string): User[] {
  const normalizedSearch = searchTerm.trim().toLowerCase()

  if (!normalizedSearch) {
    return users
  }

  return users.filter((user) => user.name.toLowerCase().includes(normalizedSearch))
}

export function UserDirectory({ selectedUserId, onSelectUser }: UserDirectoryProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const { data: users = [], error, isError, isPending } = useUsers()
  const filteredUsers = useMemo(() => filterUsersByName(users, searchTerm), [users, searchTerm])

  return (
    <section aria-labelledby="user-directory-heading">
      <h2 id="user-directory-heading">Users</h2>
      <UserSearch value={searchTerm} onChange={setSearchTerm} />

      {isPending ? (
        <p role="status">Loading users...</p>
      ) : isError ? (
        <p role="alert">{getErrorMessage(error)}</p>
      ) : filteredUsers.length === 0 ? (
        <p role="status">No users found.</p>
      ) : (
        <UserList
          users={filteredUsers}
          selectedUserId={selectedUserId}
          onSelectUser={onSelectUser}
        />
      )}
    </section>
  )
}
