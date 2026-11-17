import { useQuery } from '@tanstack/react-query'
import { getUsers } from '../api/users'
import { queryKeys } from '../lib/queryKeys'

export function useUsers() {
  return useQuery({
    queryKey: queryKeys.users,
    queryFn: getUsers,
  })
}
