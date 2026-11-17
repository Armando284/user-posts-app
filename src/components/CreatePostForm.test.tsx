import { describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { CreatePostInput } from '../schemas/post'
import { CreatePostForm } from './CreatePostForm'

function renderCreatePostForm(onSubmit: (values: CreatePostInput) => void = vi.fn()) {
  render(<CreatePostForm onSubmit={onSubmit} />)

  return { onSubmit }
}

describe('CreatePostForm', () => {
  it('renders the labelled form and required controls', () => {
    renderCreatePostForm()

    expect(screen.getByRole('form', { name: 'Create a post' })).toBeInTheDocument()
    expect(screen.getByLabelText('Title')).toBeRequired()
    expect(screen.getByLabelText('Post content')).toBeRequired()
    expect(screen.getByRole('button', { name: 'Create post' })).toBeInTheDocument()
  })

  it('requires a title', async () => {
    const user = userEvent.setup()
    const { onSubmit } = renderCreatePostForm()

    await user.type(screen.getByLabelText('Post content'), 'Post body')
    await user.click(screen.getByRole('button', { name: 'Create post' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Title is required')
    expect(screen.getByLabelText('Title')).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByLabelText('Title')).toHaveAccessibleDescription('Title is required')
    expect(screen.getByLabelText('Title')).toHaveFocus()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('requires post content', async () => {
    const user = userEvent.setup()
    const { onSubmit } = renderCreatePostForm()

    await user.type(screen.getByLabelText('Title'), 'Post title')
    await user.click(screen.getByRole('button', { name: 'Create post' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Post content is required')
    expect(screen.getByLabelText('Post content')).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByLabelText('Post content')).toHaveAccessibleDescription(
      'Post content is required',
    )
    expect(screen.getByLabelText('Post content')).toHaveFocus()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('submits trimmed values when the form is valid', async () => {
    const user = userEvent.setup()
    const { onSubmit } = renderCreatePostForm()

    await user.type(screen.getByLabelText('Title'), '  Post title  ')
    await user.type(screen.getByLabelText('Post content'), '  Post body  ')
    await user.click(screen.getByRole('button', { name: 'Create post' }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        title: 'Post title',
        body: 'Post body',
      })
    })

    expect(screen.getByLabelText('Title')).toHaveValue('')
    expect(screen.getByLabelText('Post content')).toHaveValue('')
  })
})
