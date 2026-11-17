import { useMemo, useState } from 'react'
import { SearchX, Users } from 'lucide-react'
import { getErrorMessage } from '../api/client'
import { useQueryErrorToast } from '../hooks/useQueryErrorToast'
import { useUsers } from '../hooks/useUsers'
import type { User } from '../types/user'
import { EmptyState, ErrorState, LoadingState } from './FeedbackStates'
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
  const { data: users = [], error, isError, isPending, refetch } = useUsers()
  const filteredUsers = useMemo(() => filterUsersByName(users, searchTerm), [users, searchTerm])

  useQueryErrorToast({
    error,
    isError,
    title: 'Could not load users',
    toastId: 'users-load-error',
  })

  return (
    <section
      aria-labelledby="user-directory-heading"
      className="flex flex-col gap-4 rounded-2xl border border-line bg-surface p-4 shadow-sm sm:p-5 lg:sticky lg:top-8"
    >
      <h2
        id="user-directory-heading"
        className="flex items-center gap-2 text-lg font-semibold tracking-tight text-ink"
      >
        <Users aria-hidden="true" className="size-4 text-muted" strokeWidth={1.75} />
        Users
      </h2>

      <UserSearch value={searchTerm} onChange={setSearchTerm} />

      {isPending ? (
        <LoadingState label="Loading users...">
          {Array.from({ length: 4 }, (_, index) => (
            <div
              key={index}
              className="flex flex-col gap-2 rounded-lg bg-canvas px-3 py-3 motion-safe:animate-pulse motion-reduce:animate-none"
            >
              <div className="h-3.5 w-2/3 rounded bg-line/80" />
              <div className="h-3 w-1/2 rounded bg-line/60" />
            </div>
          ))}
        </LoadingState>
      ) : isError ? (
        <ErrorState
          message={getErrorMessage(error)}
          onRetry={() => {
            void refetch()
          }}
        />
      ) : filteredUsers.length === 0 ? (
        <EmptyState icon={SearchX}>
          <p className="font-medium text-ink">No users found.</p>
          <p className="mt-1">Try a different name.</p>
        </EmptyState>
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
