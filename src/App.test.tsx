import { describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'
import { usersFixture } from './test/fixtures'
import { renderWithQueryClient } from './test/render'
import App from './App'

describe('App', () => {
  it('renders the application and user directory', async () => {
    renderWithQueryClient(<App />)

    expect(screen.getByRole('heading', { level: 1, name: 'User Posts' })).toBeInTheDocument()
    expect(await screen.findByText(usersFixture[0].name)).toBeInTheDocument()
  })
})
