import { useCreatePost } from '../hooks/useCreatePost'
import { CreatePostForm } from './CreatePostForm'

interface CreatePostSectionProps {
  userId: number
}

export function CreatePostSection({ userId }: CreatePostSectionProps) {
  const createPost = useCreatePost(userId)

  return <CreatePostForm onSubmit={createPost} />
}
