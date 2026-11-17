import { Check } from 'lucide-react'
import type { User } from '../types/user'

interface UserListProps {
  users: User[]
  selectedUserId: number | null
  onSelectUser: (userId: number) => void
}

export function UserList({ users, selectedUserId, onSelectUser }: UserListProps) {
  return (
    <ul aria-label="Users" className="flex flex-col gap-1">
      {users.map((user) => {
        const isSelected = selectedUserId === user.id

        return (
          <li key={user.id}>
            <button
              type="button"
              aria-controls="posts-panel"
              aria-pressed={isSelected}
              onClick={() => onSelectUser(user.id)}
              className={`flex w-full cursor-pointer items-start justify-between gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${
                isSelected
                  ? 'bg-accent-soft text-accent-strong ring-1 ring-accent/15'
                  : 'text-ink hover:bg-canvas'
              }`}
            >
              <span className="flex flex-col gap-0.5">
                <span className="text-sm font-semibold leading-5">{user.name}</span>
                <span
                  className={`text-sm leading-5 ${isSelected ? 'text-accent-strong' : 'text-muted'}`}
                >
                  {user.email}
                </span>
              </span>
              {isSelected ? (
                <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0" strokeWidth={2.25} />
              ) : null}
            </button>
          </li>
        )
      })}
    </ul>
  )
}
