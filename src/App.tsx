import { useState, type CSSProperties } from 'react'
import { CircleAlert, CircleCheck, LoaderCircle } from 'lucide-react'
import { Toaster } from 'sonner'
import './App.css'
import { PostsPanel } from './components/PostsPanel'
import { UserDirectory } from './components/UserDirectory'

const toasterStyle = {
  '--normal-bg': 'var(--color-surface)',
  '--normal-text': 'var(--color-ink)',
  '--normal-border': 'var(--color-line)',
  '--success-bg': 'var(--color-accent-soft)',
  '--success-border': 'color-mix(in srgb, var(--color-accent) 22%, var(--color-accent-soft))',
  '--success-text': 'var(--color-accent-strong)',
  '--error-bg': 'var(--color-danger-soft)',
  '--error-border': 'color-mix(in srgb, var(--color-danger) 18%, var(--color-danger-soft))',
  '--error-text': 'var(--color-danger)',
  fontFamily: 'var(--font-sans)',
} as CSSProperties

const toastIcons = {
  success: <CircleCheck aria-hidden="true" className="size-4" />,
  error: <CircleAlert aria-hidden="true" className="size-4" />,
  loading: <LoaderCircle aria-hidden="true" className="size-4 motion-safe:animate-spin" />,
}

function App() {
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null)

  return (
    <>
      <main className="app-shell">
        <div className="app-container">
          <header className="flex max-w-2xl flex-col gap-2">
            <h1 className="text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl">
              User Posts
            </h1>
            <p className="text-base leading-7 text-muted">
              Find a person, read their posts, and add your own.
            </p>
          </header>

          <div className="app-layout">
            <UserDirectory selectedUserId={selectedUserId} onSelectUser={setSelectedUserId} />
            <PostsPanel selectedUserId={selectedUserId} />
          </div>
        </div>
      </main>

      <Toaster
        position="top-right"
        theme="light"
        richColors
        closeButton
        duration={4000}
        icons={toastIcons}
        toastOptions={{ closeButtonAriaLabel: 'Dismiss notification' }}
        style={toasterStyle}
      />
    </>
  )
}

export default App
