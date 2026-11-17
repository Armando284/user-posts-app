import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { toast } from 'sonner'
import { useQueryErrorToast } from './useQueryErrorToast'

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
  },
}))

interface TestComponentProps {
  error: unknown
  isError: boolean
}

function TestComponent({ error, isError }: TestComponentProps) {
  useQueryErrorToast({
    error,
    isError,
    title: 'Could not load users',
    toastId: 'users-load-error',
  })

  return <p>Ready</p>
}

describe('useQueryErrorToast', () => {
  it('shows an error notification when a query fails', () => {
    render(<TestComponent error={new Error('Network unavailable')} isError />)

    expect(screen.getByText('Ready')).toBeInTheDocument()
    expect(toast.error).toHaveBeenCalledWith('Could not load users', {
      id: 'users-load-error',
      description: 'Network unavailable',
    })
  })

  it('does not notify when there is no error', () => {
    render(<TestComponent error={null} isError={false} />)

    expect(toast.error).not.toHaveBeenCalled()
  })
})
