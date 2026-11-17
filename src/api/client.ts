const API_BASE_URL = 'https://jsonplaceholder.typicode.com'

export class ApiError extends Error {
  readonly status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export async function apiRequest<T>(path: string, options?: RequestInit): Promise<T> {
  const url = new URL(path, `${API_BASE_URL}/`)
  const response = await fetch(url, options)

  if (!response.ok) {
    throw new ApiError(
      `API request failed: ${response.status} ${response.statusText}`,
      response.status,
    )
  }

  return (await response.json()) as T
}
