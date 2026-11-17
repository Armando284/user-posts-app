import { useState } from 'react'
import './App.css'
import { PostsPanel } from './components/PostsPanel'
import { UserDirectory } from './components/UserDirectory'

function App() {
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null)

  return (
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
  )
}

export default App
