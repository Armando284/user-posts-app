import { describe, expect, it } from 'vitest'
import { http, HttpResponse } from 'msw'
import { server } from '../test/server'
import { ApiError, apiRequest } from './client'

describe('apiRequest', () => {
  it('returns parsed JSON from a successful response', async () => {
    const result = await apiRequest<{ id: number }>('/test')

    expect(result).toEqual({ id: 1 })
  })

  it('throws ApiError when the response is unsuccessful', async () => {
    server.use(
      http.get('https://jsonplaceholder.typicode.com/test', () =>
        HttpResponse.json({ message: 'Not found' }, { status: 404 }),
      ),
    )

    await expect(apiRequest('/test')).rejects.toBeInstanceOf(ApiError)
    
    await expect(apiRequest('/test')).rejects.toMatchObject({
      name: 'ApiError',
      status: 404,
    })
  })
})
