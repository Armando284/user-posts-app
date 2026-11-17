import { getErrorMessage } from '../api/client'
import { usePosts } from '../hooks/usePosts'
import { CreatePostSection } from './CreatePostSection'
import { PostList } from './PostList'

interface PostsPanelProps {
  selectedUserId: number | null
}

export function PostsPanel({ selectedUserId }: PostsPanelProps) {
  const { data: posts = [], error, isError, isPending } = usePosts(selectedUserId)

  return (
    <section
      aria-labelledby="posts-heading"
      className="flex min-h-[26rem] flex-col gap-6 rounded-2xl border border-line bg-surface p-5 shadow-sm sm:p-6"
    >
      <h2 id="posts-heading" className="text-lg font-semibold tracking-tight text-ink">
        Posts
      </h2>

      {selectedUserId === null ? (
        <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-line bg-canvas px-6 py-12">
          <p className="max-w-sm text-center text-sm leading-6 text-muted">
            Select a user to view their posts.
          </p>
        </div>
      ) : (
        <>
          {isPending ? (
            <p
              role="status"
              className="rounded-xl bg-canvas px-4 py-6 text-sm leading-6 text-muted"
            >
              Loading posts...
            </p>
          ) : isError ? (
            <p
              role="alert"
              className="rounded-xl bg-danger-soft px-4 py-6 text-sm font-medium leading-6 text-danger"
            >
              {getErrorMessage(error)}
            </p>
          ) : posts.length === 0 ? (
            <p
              role="status"
              className="rounded-xl border border-dashed border-line bg-canvas px-4 py-10 text-center text-sm leading-6 text-muted"
            >
              No posts found for this user.
            </p>
          ) : (
            <PostList posts={posts} />
          )}

          <CreatePostSection userId={selectedUserId} />
        </>
      )}
    </section>
  )
}
