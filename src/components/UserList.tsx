import type { User } from '../types/user'

interface UserListProps {
  users: User[]
  selectedUserId: number | null
  onSelectUser: (userId: number) => void
}

export function UserList({ users, selectedUserId, onSelectUser }: UserListProps) {
  return (
    <ul aria-label="Users">
      {users.map((user) => (
        <li key={user.id}>
          <button
            type="button"
            aria-pressed={selectedUserId === user.id}
            onClick={() => onSelectUser(user.id)}
          >
            <span>{user.name}</span>
            <span>{user.email}</span>
          </button>
        </li>
      ))}
    </ul>
  )
}
