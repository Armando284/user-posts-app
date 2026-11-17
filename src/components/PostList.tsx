import type { Post } from '../types/post'

interface PostListProps {
  posts: Post[]
}

export function PostList({ posts }: PostListProps) {
  return (
    <ul aria-label="Posts" className="flex flex-col divide-y divide-line">
      {posts.map((post) => (
        <li key={post.id} className="flex flex-col gap-2 py-5 first:pt-0 last:pb-0">
          <h3 className="text-base font-semibold leading-6 text-ink">{post.title}</h3>
          <p className="max-w-prose whitespace-pre-line text-base leading-7 text-muted">
            {post.body}
          </p>
        </li>
      ))}
    </ul>
  )
}
