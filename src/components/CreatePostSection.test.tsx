import { beforeEach, describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { toast } from 'sonner'
import { useCreatePost } from '../hooks/useCreatePost'
import { renderWithQueryClient } from '../test/render'
import { CreatePostSection } from './CreatePostSection'

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

vi.mock('../hooks/useCreatePost', () => ({
  useCreatePost: vi.fn(),
}))

const useCreatePostMock = vi.mocked(useCreatePost)

beforeEach(() => {
  useCreatePostMock.mockReset()
})

describe('CreatePostSection', () => {
  it('shows success feedback and clears the form after creating a post', async () => {
    const createPost = vi.fn((values: { title: string; body: string }) => ({
      id: -1,
      userId: 1,
      ...values,
    }))
    useCreatePostMock.mockReturnValue(createPost)

    const user = userEvent.setup()
    renderWithQueryClient(<CreatePostSection userId={1} />)

    await user.type(screen.getByLabelText('Title'), 'Feedback post')
    await user.type(screen.getByLabelText('Post content'), 'Body')
    await user.click(screen.getByRole('button', { name: 'Create post' }))

    expect(createPost).toHaveBeenCalledWith({ title: 'Feedback post', body: 'Body' })
    expect(toast.success).toHaveBeenCalledWith('Post created', {
      description: 'Post "Feedback post" was added to the list.',
    })
    expect(screen.getByLabelText('Title')).toHaveValue('')
  })

  it('shows error feedback and keeps values when creation fails', async () => {
    useCreatePostMock.mockReturnValue(() => {
      throw new Error('Storage unavailable')
    })

    const user = userEvent.setup()
    renderWithQueryClient(<CreatePostSection userId={1} />)

    await user.type(screen.getByLabelText('Title'), 'Failed post')
    await user.type(screen.getByLabelText('Post content'), 'Body')
    await user.click(screen.getByRole('button', { name: 'Create post' }))

    expect(toast.error).toHaveBeenCalledWith('Could not create post', {
      description: 'Storage unavailable',
    })
    expect(screen.getByLabelText('Title')).toHaveValue('Failed post')
  })
})
