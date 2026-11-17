import { useState } from 'react'
import './App.css'
import { PostsPanel } from './components/PostsPanel'
import { UserDirectory } from './components/UserDirectory'

function App() {
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null)

  return (
    <main>
      <h1>User Posts</h1>
      <UserDirectory selectedUserId={selectedUserId} onSelectUser={setSelectedUserId} />
      <PostsPanel selectedUserId={selectedUserId} />
    </main>
  )
}

export default App
