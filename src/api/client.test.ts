import { describe, expect, it } from 'vitest'
import { http, HttpResponse } from 'msw'
import { server } from '../test/server'
import { ApiError, apiRequest, getErrorMessage } from './client'

const API_URL = 'https://jsonplaceholder.typicode.com'

describe('apiRequest', () => {
  it('returns parsed JSON from a successful response', async () => {
    const result = await apiRequest<{ id: number }>('/test')

    expect(result).toEqual({ id: 1 })
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

  it('normalizes client and server error statuses', async () => {
    server.use(
      http.get(`${API_URL}/bad-request`, () => HttpResponse.json(null, { status: 400 })),
      http.get(`${API_URL}/server-error`, () => HttpResponse.json(null, { status: 500 })),
    )

    await expect(apiRequest('/bad-request')).rejects.toMatchObject({
      status: 400,
      message: 'The request was invalid. Please check your input and try again.',
    })

    await expect(apiRequest('/server-error')).rejects.toMatchObject({
      status: 500,
      message: 'The server encountered an error. Please try again later.',
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
