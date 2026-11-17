import type { User } from '../types/user'

interface UserListProps {
  users: User[]
}

export function UserList({ users }: UserListProps) {
  return (
    <ul aria-label="Users">
      {users.map((user) => (
        <li key={user.id}>
          <span>{user.name}</span>
          <span>{user.email}</span>
        </li>
      ))}
    </ul>
  )
}
