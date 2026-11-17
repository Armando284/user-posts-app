const API_BASE_URL = 'https://jsonplaceholder.typicode.com'

const DEFAULT_ERROR_MESSAGE = 'Something went wrong. Please try again.'
const NETWORK_ERROR_MESSAGE = 'Unable to reach the server. Check your connection and try again.'
const INVALID_RESPONSE_MESSAGE = 'The server returned an unexpected response. Please try again.'

const HTTP_ERROR_MESSAGES: Record<number, string> = {
  400: 'The request was invalid. Please check your input and try again.',
  401: 'You are not authorized to perform this action.',
  403: 'You do not have permission to perform this action.',
  404: 'The requested resource could not be found.',
  409: 'The request conflicts with the current state of the resource.',
  422: 'The submitted data could not be processed.',
  429: 'Too many requests. Please wait a moment and try again.',
  500: 'The server encountered an error. Please try again later.',
  502: 'The server is temporarily unavailable. Please try again later.',
  503: 'The service is temporarily unavailable. Please try again later.',
  504: 'The server took too long to respond. Please try again later.',
}

export class ApiError extends Error {
  readonly status: number | undefined

  constructor(message: string, status?: number, options?: ErrorOptions) {
    super(message, options)
    this.name = 'ApiError'
    this.status = status
  }
}

function getHttpErrorMessage(status: number, statusText: string): string {
  const knownMessage = HTTP_ERROR_MESSAGES[status]

  if (knownMessage) {
    return knownMessage
  }

  if (statusText) {
    return `The request failed (${status} ${statusText}). Please try again.`
  }

  return `The request failed with status ${status}. Please try again.`
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message.trim()) {
    return error.message
  }

  return DEFAULT_ERROR_MESSAGE
}

export async function apiRequest<T>(path: string, options?: RequestInit): Promise<T> {
  const url = new URL(path, `${API_BASE_URL}/`)
  let response: Response

  try {
    response = await fetch(url, options)
  } catch (error) {
    throw new ApiError(NETWORK_ERROR_MESSAGE, undefined, { cause: error })
  }

  if (!response.ok) {
    throw new ApiError(getHttpErrorMessage(response.status, response.statusText), response.status)
  }

  try {
    return (await response.json()) as T
  } catch (error) {
    throw new ApiError(INVALID_RESPONSE_MESSAGE, response.status, { cause: error })
  }
}
