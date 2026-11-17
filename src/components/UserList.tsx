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
              aria-pressed={isSelected}
              onClick={() => onSelectUser(user.id)}
              className={`flex w-full cursor-pointer flex-col gap-0.5 rounded-lg px-3 py-2.5 text-left transition-colors ${
                isSelected
                  ? 'bg-accent-soft text-accent-strong ring-1 ring-accent/15'
                  : 'text-ink hover:bg-canvas'
              }`}
            >
              <span className="text-sm font-semibold leading-5">{user.name}</span>
              <span
                className={`text-sm leading-5 ${isSelected ? 'text-accent-strong' : 'text-muted'}`}
              >
                {user.email}
              </span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}
