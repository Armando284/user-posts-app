import { useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '../lib/queryKeys'
import type { CreatePostInput } from '../schemas/post'
import type { Post } from '../types/post'

let nextTemporaryPostId = 0

function createTemporaryPostId(): number {
  nextTemporaryPostId -= 1
  return nextTemporaryPostId
}

export function useCreatePost(userId: number) {
  const queryClient = useQueryClient()

  return useCallback(
    (values: CreatePostInput) => {
      const post: Post = {
        id: createTemporaryPostId(),
        userId,
        title: values.title,
        body: values.body,
      }

      queryClient.setQueryData<Post[]>(queryKeys.posts(userId), (posts = []) => [post, ...posts])

      return post
    },
    [queryClient, userId],
  )
}
