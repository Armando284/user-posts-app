import { describe, expect, it, vi } from 'vitest'

describe('MSW server configuration', () => {
  it('rejects requests that are not explicitly mocked', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

    try {
      const error = await fetch('https://jsonplaceholder.typicode.com/albums').catch(
        (cause: unknown) => cause,
      )

      expect(error).toBeInstanceOf(TypeError)
      expect(error).toMatchObject({
        message: 'fetch failed',
        cause: expect.objectContaining({
          message: expect.stringContaining(
            'Cannot bypass a request when using the "error" strategy for the "onUnhandledFrame" option.',
          ),
        }),
      })
    } finally {
      consoleError.mockRestore()
    }
  })
})
