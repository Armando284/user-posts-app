import { FileText, MessageSquareDashed, MousePointerClick } from 'lucide-react'
import { getErrorMessage } from '../api/client'
import { useQueryErrorToast } from '../hooks/useQueryErrorToast'
import { usePosts } from '../hooks/usePosts'
import { CreatePostSection } from './CreatePostSection'
import { EmptyState, ErrorState, LoadingState } from './FeedbackStates'
import { PostList } from './PostList'

interface PostsPanelProps {
  selectedUserId: number | null
}

export function PostsPanel({ selectedUserId }: PostsPanelProps) {
  const { data: posts = [], error, isError, isPending, refetch } = usePosts(selectedUserId)

  useQueryErrorToast({
    error,
    isError,
    title: 'Could not load posts',
    toastId: 'posts-load-error',
  })

  return (
    <section
      id="posts-panel"
      aria-labelledby="posts-heading"
      className="flex min-h-[26rem] flex-col gap-6 rounded-2xl border border-line bg-surface p-5 shadow-sm sm:p-6"
    >
      <h2
        id="posts-heading"
        className="flex items-center gap-2 text-lg font-semibold tracking-tight text-ink"
      >
        <FileText aria-hidden="true" className="size-4 text-muted" strokeWidth={1.75} />
        Posts
      </h2>

      {selectedUserId === null ? (
        <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-line bg-canvas px-6 py-12">
          <div className="flex max-w-sm flex-col items-center gap-3 text-center">
            <MousePointerClick
              aria-hidden="true"
              className="size-5 text-muted"
              strokeWidth={1.75}
            />
            <p className="text-sm leading-6 text-muted">Select a user to view their posts.</p>
          </div>
        </div>
      ) : (
        <>
          {isPending ? (
            <LoadingState label="Loading posts...">
              {Array.from({ length: 3 }, (_, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-3 rounded-xl bg-canvas px-4 py-4 motion-safe:animate-pulse motion-reduce:animate-none"
                >
                  <div className="h-4 w-2/5 rounded bg-line/80" />
                  <div className="flex flex-col gap-2">
                    <div className="h-3 w-full rounded bg-line/60" />
                    <div className="h-3 w-11/12 rounded bg-line/60" />
                    <div className="h-3 w-3/5 rounded bg-line/60" />
                  </div>
                </div>
              ))}
            </LoadingState>
          ) : isError ? (
            <ErrorState
              message={getErrorMessage(error)}
              onRetry={() => {
                void refetch()
              }}
            />
          ) : posts.length === 0 ? (
            <EmptyState icon={MessageSquareDashed}>
              <p className="font-medium text-ink">No posts found for this user.</p>
              <p className="mt-1">Create the first post below.</p>
            </EmptyState>
          ) : (
            <PostList posts={posts} />
          )}

          <CreatePostSection userId={selectedUserId} />
        </>
      )}
    </section>
  )
}
