import { describe, expect, it } from 'vitest'
import { getPostsByUser } from '../api/posts'
import { getUsers } from '../api/users'
import { postsFixture, usersFixture } from './fixtures'

describe('MSW handlers', () => {
  it('serves the users fixture', async () => {
    await expect(getUsers()).resolves.toEqual(usersFixture)
  })

  it('serves posts filtered by user id', async () => {
    await expect(getPostsByUser(1)).resolves.toEqual(
      postsFixture.filter((post) => post.userId === 1),
    )
  })

  it('serves an empty collection for a user without posts', async () => {
    await expect(getPostsByUser(3)).resolves.toEqual([])
  })
})
