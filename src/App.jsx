import { useState } from 'react'
import Navbar from './components/Navbar'
import Blog from './components/Blog'
import Tournaments from './components/Tournaments'
import Classes from './components/Classes'
import Trainers from './components/Trainers'

function App() {
  const [tab, setTab] = useState('blog')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-blue-200">
      <Navbar active={tab} onChange={setTab} />
      <div className="max-w-6xl mx-auto px-4 py-8">
        {tab === 'blog' && <Blog />}
        {tab === 'tournaments' && <Tournaments />}
        {tab === 'classes' && <Classes />}
        {tab === 'trainers' && <Trainers />}
      </div>
    </div>
  )
}

export default App
