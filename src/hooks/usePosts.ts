import { skipToken, useQuery } from '@tanstack/react-query'
import { getPostsByUser } from '../api/posts'
import { queryKeys } from '../lib/queryKeys'

export function usePosts(userId: number | null) {
  return useQuery({
    queryKey: queryKeys.posts(userId),
    queryFn: userId === null ? skipToken : () => getPostsByUser(userId),
  })
}
