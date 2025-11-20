import { useEffect, useState } from 'react'

const API = import.meta.env.VITE_BACKEND_URL

export default function Classes() {
  const [list, setList] = useState([])
  const [filter, setFilter] = useState({ premium: null })
  const [form, setForm] = useState({ title: '', description: '', level: '', video_url: '', is_premium: false, price: '' })

  const load = async () => {
    const qs = new URLSearchParams()
    if (filter.premium !== null) qs.append('premium', String(filter.premium))
    const res = await fetch(`${API}/api/classes?${qs.toString()}`)
    setList(await res.json())
  }

  useEffect(() => { load() }, [])

  const submit = async (e) => {
    e.preventDefault()
    await fetch(`${API}/api/classes`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({
        ...form,
        price: form.is_premium ? Number(form.price || 0) : null,
      })
    })
    setForm({ title: '', description: '', level: '', video_url: '', is_premium: false, price: '' })
    load()
  }

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-4">
        {list.map(c => (
          <div key={c._id} className="bg-slate-800/50 border border-white/10 p-4 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white text-lg font-semibold">{c.title} {c.is_premium && <span className="text-xs text-yellow-300 align-super">Premium</span>}</div>
                <div className="text-blue-300 text-sm">{c.level || 'All levels'}</div>
              </div>
              {c.price ? <div className="text-yellow-300 font-semibold">${c.price}</div> : <div className="text-green-300 text-sm">Free</div>}
            </div>
            <p className="text-blue-200/80 mt-2">{c.description}</p>
            {c.video_url && (
              <a href={c.video_url} target="_blank" className="text-blue-300 hover:text-white text-sm underline">Watch video</a>
            )}
          </div>
        ))}
      </div>
      <div className="bg-slate-800/50 border border-white/10 p-4 rounded-xl">
        <div className="text-white font-medium mb-2">Add Class</div>
        <form onSubmit={submit} className="space-y-2">
          <input className="w-full px-3 py-2 rounded bg-slate-900/60 text-white border border-white/10" placeholder="Title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} />
          <textarea className="w-full px-3 py-2 rounded bg-slate-900/60 text-white border border-white/10" rows={4} placeholder="Description" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} />
          <input className="w-full px-3 py-2 rounded bg-slate-900/60 text-white border border-white/10" placeholder="Level" value={form.level} onChange={e=>setForm({...form,level:e.target.value})} />
          <input className="w-full px-3 py-2 rounded bg-slate-900/60 text-white border border-white/10" placeholder="Video URL" value={form.video_url} onChange={e=>setForm({...form,video_url:e.target.value})} />
          <label className="flex items-center gap-2 text-blue-200 text-sm">
            <input type="checkbox" checked={form.is_premium} onChange={e=>setForm({...form,is_premium:e.target.checked})} /> Premium class
          </label>
          {form.is_premium && (
            <input type="number" step="0.01" min="0" className="w-full px-3 py-2 rounded bg-slate-900/60 text-white border border-white/10" placeholder="Price (USD)" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} />
          )}
          <button className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded px-3 py-2">Save</button>
        </form>
      </div>
    </div>
  )
}
