import { http, HttpResponse } from 'msw'

export const handlers = [
  http.get('https://jsonplaceholder.typicode.com/test', () => HttpResponse.json({ id: 1 })),
]
