import { useEffect } from 'react'
import { toast } from 'sonner'
import { getErrorMessage } from '../api/client'

interface QueryErrorToastOptions {
  error: unknown
  isError: boolean
  title: string
  toastId: string
}

export function useQueryErrorToast({ error, isError, title, toastId }: QueryErrorToastOptions) {
  useEffect(() => {
    if (!isError) {
      return
    }

    toast.error(title, {
      id: toastId,
      description: getErrorMessage(error),
    })
  }, [error, isError, title, toastId])
}
