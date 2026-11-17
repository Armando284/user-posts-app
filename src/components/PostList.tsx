import { motion, useReducedMotion } from 'motion/react'
import type { Post } from '../types/post'

interface PostListProps {
  posts: Post[]
}

export function PostList({ posts }: PostListProps) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <ul aria-label="Posts" className="flex flex-col divide-y divide-line">
      {posts.map((post, index) => (
        <motion.li
          key={post.id}
          className="flex flex-col gap-2 py-5 first:pt-0 last:pb-0"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.18,
            ease: [0.16, 1, 0.3, 1],
            delay: shouldReduceMotion ? 0 : Math.min(index * 0.02, 0.1),
          }}
        >
          <h3 className="text-base font-semibold leading-6 text-ink">{post.title}</h3>
          <p className="max-w-prose whitespace-pre-line text-base leading-7 text-muted">
            {post.body}
          </p>
        </motion.li>
      ))}
    </ul>
  )
}
