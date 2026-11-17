import { apiRequest } from './client'
import type { Post } from '../types/post'

export function getPostsByUser(userId: number): Promise<Post[]> {
  const params = new URLSearchParams({
    userId: String(userId),
  })

  return apiRequest<Post[]>(`/posts?${params.toString()}`)
}
