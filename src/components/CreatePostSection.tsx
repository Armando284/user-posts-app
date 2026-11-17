import { useCreatePost } from '../hooks/useCreatePost'
import { CreatePostForm } from './CreatePostForm'

interface CreatePostSectionProps {
  userId: number
}

export function CreatePostSection({ userId }: CreatePostSectionProps) {
  const createPost = useCreatePost(userId)

  return (
    <div className="border-t border-line pt-6">
      <CreatePostForm onSubmit={createPost} />
    </div>
  )
}
