import { z } from 'zod'

export const createPostSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  body: z.string().trim().min(1, 'Post content is required'),
})

export type CreatePostInput = z.infer<typeof createPostSchema>
