import { describe, expect, it } from 'vitest'
import { http, HttpResponse } from 'msw'
import { server } from '../test/server'
import { usersFixture } from '../test/fixtures'
import type { User } from '../types/user'
import { ApiError, apiRequest, getErrorMessage } from './client'

const API_URL = 'https://jsonplaceholder.typicode.com'

describe('apiRequest', () => {
  it('returns parsed JSON from a successful response', async () => {
    const result = await apiRequest<User[]>('/users')

    expect(result).toEqual(usersFixture)
  })

  it('throws ApiError with a normalized message for HTTP errors', async () => {
    server.use(
      http.get(`${API_URL}/test`, () =>
        HttpResponse.json({ message: 'Not found' }, { status: 404 }),
      ),
    )

    await expect(apiRequest('/test')).rejects.toMatchObject({
      name: 'ApiError',
      status: 404,
      message: 'The requested resource could not be found.',
    })
  })

  it.each([
    [400, 'The request was invalid. Please check your input and try again.'],
    [401, 'You are not authorized to perform this action.'],
    [403, 'You do not have permission to perform this action.'],
    [429, 'Too many requests. Please wait a moment and try again.'],
    [500, 'The server encountered an error. Please try again later.'],
    [503, 'The service is temporarily unavailable. Please try again later.'],
  ] as const)('normalizes HTTP %i error responses', async (status, message) => {
    server.use(http.get(`${API_URL}/status/${status}`, () => HttpResponse.json(null, { status })))

    await expect(apiRequest(`/status/${status}`)).rejects.toMatchObject({
      name: 'ApiError',
      status,
      message,
    })
  })

  it('falls back to a generic message for unmapped status codes', async () => {
    server.use(
      http.get(`${API_URL}/teapot`, () =>
        HttpResponse.json(null, { status: 418, statusText: 'I am a teapot' }),
      ),
    )

    await expect(apiRequest('/teapot')).rejects.toMatchObject({
      status: 418,
      message: expect.stringContaining('The request failed'),
    })
  })

  it('throws a normalized ApiError when the network request fails', async () => {
    server.use(http.get(`${API_URL}/network-error`, () => HttpResponse.error()))

    await expect(apiRequest('/network-error')).rejects.toMatchObject({
      name: 'ApiError',
      status: undefined,
      message: 'Unable to reach the server. Check your connection and try again.',
    })
  })

  it('throws a normalized ApiError when the response body is invalid JSON', async () => {
    server.use(
      http.get(
        `${API_URL}/invalid-json`,
        () =>
          new HttpResponse('not valid json', {
            headers: { 'Content-Type': 'application/json' },
          }),
      ),
    )

    await expect(apiRequest('/invalid-json')).rejects.toMatchObject({
      name: 'ApiError',
      status: 200,
      message: 'The server returned an unexpected response. Please try again.',
    })
  })
})

describe('getErrorMessage', () => {
  it('returns the message from an Error instance', () => {
    expect(getErrorMessage(new Error('Something specific failed'))).toBe(
      'Something specific failed',
    )
  })

  it('returns the normalized message from an ApiError', () => {
    expect(getErrorMessage(new ApiError('Normalized message', 500))).toBe('Normalized message')
  })

  it('returns a default message for unknown thrown values', () => {
    expect(getErrorMessage('unexpected')).toBe('Something went wrong. Please try again.')
    expect(getErrorMessage(null)).toBe('Something went wrong. Please try again.')
    expect(getErrorMessage(undefined)).toBe('Something went wrong. Please try again.')
  })

  it('returns the default message when an Error has an empty message', () => {
    expect(getErrorMessage(new Error(''))).toBe('Something went wrong. Please try again.')
  })
})
