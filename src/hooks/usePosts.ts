import { skipToken, useQuery, useQueryClient } from '@tanstack/react-query'
import { getPostsByUser } from '../api/posts'
import { queryKeys } from '../lib/queryKeys'
import type { Post } from '../types/post'

export function usePosts(userId: number | null) {
  const queryClient = useQueryClient()

  return useQuery({
    queryKey: queryKeys.posts(userId),
    queryFn:
      userId === null
        ? skipToken
        : async () => {
            const serverPosts = await getPostsByUser(userId)
            const cachedPosts = queryClient.getQueryData<Post[]>(queryKeys.posts(userId)) ?? []
            const localPosts = cachedPosts.filter((post) => post.id < 0)

            return [...localPosts, ...serverPosts]
          },
  })
}
