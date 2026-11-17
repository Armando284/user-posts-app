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
    <section
      aria-labelledby="user-directory-heading"
      className="flex flex-col gap-4 rounded-2xl border border-line bg-surface p-4 shadow-sm sm:p-5 lg:sticky lg:top-8"
    >
      <h2 id="user-directory-heading" className="text-lg font-semibold tracking-tight text-ink">
        Users
      </h2>

      <UserSearch value={searchTerm} onChange={setSearchTerm} />

      {isPending ? (
        <p role="status" className="rounded-xl bg-canvas px-4 py-6 text-sm leading-6 text-muted">
          Loading users...
        </p>
      ) : isError ? (
        <p
          role="alert"
          className="rounded-xl bg-danger-soft px-4 py-6 text-sm font-medium leading-6 text-danger"
        >
          {getErrorMessage(error)}
        </p>
      ) : filteredUsers.length === 0 ? (
        <p
          role="status"
          className="rounded-xl border border-dashed border-line bg-canvas px-4 py-10 text-center text-sm leading-6 text-muted"
        >
          No users found.
        </p>
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
