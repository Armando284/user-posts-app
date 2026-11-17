import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { postsFixture } from '../test/fixtures'
import { PostList } from './PostList'

describe('PostList', () => {
  it('renders an accessible list of posts', () => {
    const posts = postsFixture.filter((post) => post.userId === 1)
    render(<PostList posts={posts} />)

    expect(screen.getByRole('list', { name: 'Posts' })).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(posts.length)
  })

  it('renders each post title and body', () => {
    const posts = postsFixture.filter((post) => post.userId === 1)
    render(<PostList posts={posts} />)

    for (const post of posts) {
      expect(screen.getByText(post.title)).toBeInTheDocument()
      expect(screen.getByText(post.body)).toBeInTheDocument()
    }
  })
})
