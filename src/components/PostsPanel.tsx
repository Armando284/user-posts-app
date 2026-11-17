import { getErrorMessage } from '../api/client'
import { usePosts } from '../hooks/usePosts'
import { PostList } from './PostList'

interface PostsPanelProps {
  selectedUserId: number | null
}

export function PostsPanel({ selectedUserId }: PostsPanelProps) {
  const { data: posts = [], error, isError, isPending } = usePosts(selectedUserId)

  return (
    <section aria-labelledby="posts-heading">
      <h2 id="posts-heading">Posts</h2>

      {selectedUserId === null ? (
        <p>Select a user to view their posts.</p>
      ) : isPending ? (
        <p role="status">Loading posts...</p>
      ) : isError ? (
        <p role="alert">{getErrorMessage(error)}</p>
      ) : posts.length === 0 ? (
        <p role="status">No posts found for this user.</p>
      ) : (
        <PostList posts={posts} />
      )}
    </section>
  )
}
