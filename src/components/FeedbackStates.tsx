import type { ReactNode } from 'react'
import { CircleAlert, type LucideIcon } from 'lucide-react'

interface LoadingStateProps {
  label: string
  children: ReactNode
}

export function LoadingState({ label, children }: LoadingStateProps) {
  return (
    <div role="status" aria-busy="true" className="flex flex-col gap-2">
      <span className="sr-only">{label}</span>
      <div aria-hidden="true" className="flex flex-col gap-2">
        {children}
      </div>
    </div>
  )
}

interface ErrorStateProps {
  message: string
  onRetry?: () => void
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex items-start gap-2.5 rounded-xl bg-danger-soft px-4 py-4 text-sm font-medium leading-6 text-danger">
      <CircleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
      <div className="flex flex-col gap-2">
        <p role="alert" aria-atomic="true">
          {message}
        </p>
        {onRetry ? (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex h-8 cursor-pointer items-center justify-center self-start rounded-md border border-danger/30 bg-surface px-2.5 text-sm font-semibold text-danger transition-colors hover:bg-danger-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger focus-visible:ring-offset-2 focus-visible:ring-offset-danger-soft"
          >
            Try again
          </button>
        ) : null}
      </div>
    </div>
  )
}

interface EmptyStateProps {
  icon: LucideIcon
  children: ReactNode
}

export function EmptyState({ icon: Icon, children }: EmptyStateProps) {
  return (
    <div
      role="status"
      className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-line bg-canvas px-4 py-10 text-center text-sm leading-6 text-muted"
    >
      <Icon aria-hidden="true" className="size-5" strokeWidth={1.75} />
      <div className="max-w-xs">{children}</div>
    </div>
  )
}
