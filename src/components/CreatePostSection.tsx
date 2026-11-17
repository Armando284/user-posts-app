import { toast } from 'sonner'
import { getErrorMessage } from '../api/client'
import { useCreatePost } from '../hooks/useCreatePost'
import type { CreatePostInput } from '../schemas/post'
import { CreatePostForm } from './CreatePostForm'

interface CreatePostSectionProps {
  userId: number
}

export function CreatePostSection({ userId }: CreatePostSectionProps) {
  const createPost = useCreatePost(userId)

  function handleSubmit(values: CreatePostInput): boolean {
    try {
      const post = createPost(values)

      toast.success('Post created', {
        description: `Post "${post.title}" was added to the list.`,
      })

      return true
    } catch (error) {
      toast.error('Could not create post', {
        description: getErrorMessage(error),
      })

      return false
    }
  }

  return (
    <div className="border-t border-line pt-6">
      <CreatePostForm onSubmit={handleSubmit} />
    </div>
  )
}
