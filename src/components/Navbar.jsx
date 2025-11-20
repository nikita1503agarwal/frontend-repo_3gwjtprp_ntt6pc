import { useState } from 'react'

const tabs = [
  { key: 'blog', label: 'Blog' },
  { key: 'tournaments', label: 'Tournaments' },
  { key: 'classes', label: 'Classes' },
  { key: 'trainers', label: 'Trainers & Booking' },
]

export default function Navbar({ active, onChange }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="w-full border-b border-white/10 bg-slate-900/60 sticky top-0 backdrop-blur z-10">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/flame-icon.svg" alt="logo" className="w-8 h-8" />
          <div className="text-white font-semibold">Tennis Connect</div>
        </div>
        <button className="text-white md:hidden" onClick={() => setOpen(!open)}>☰</button>
        <div className={`md:flex items-center gap-2 ${open ? 'block' : 'hidden md:block'}`}>
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => { onChange(t.key); setOpen(false) }}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${active === t.key ? 'bg-blue-600 text-white' : 'text-blue-200 hover:text-white hover:bg-white/10'}`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
