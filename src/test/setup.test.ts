import { describe, expect, it, vi } from 'vitest'

describe('MSW lifecycle', () => {
  it('fails requests that do not match a handler', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})

    await expect(fetch('https://jsonplaceholder.typicode.com/unhandled')).rejects.toThrow()
  })
})
