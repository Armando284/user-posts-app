import { http, HttpResponse } from 'msw'
import { postsFixture, usersFixture } from './fixtures'

const API_URL = 'https://jsonplaceholder.typicode.com'

export const handlers = [
  http.get(`${API_URL}/users`, () => HttpResponse.json(usersFixture)),
  http.get(`${API_URL}/posts`, ({ request }) => {
    const userId = new URL(request.url).searchParams.get('userId')

    if (userId === null) {
      return HttpResponse.json(postsFixture)
    }

    return HttpResponse.json(postsFixture.filter((post) => String(post.userId) === userId))
  }),
]
