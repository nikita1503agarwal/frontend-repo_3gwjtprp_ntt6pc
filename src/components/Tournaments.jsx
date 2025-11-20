import { useEffect, useState } from 'react'

const API = import.meta.env.VITE_BACKEND_URL

export default function Tournaments() {
  const [list, setList] = useState([])
  const [filter, setFilter] = useState({ country: '', upcoming_only: true })
  const [form, setForm] = useState({ name: '', country: '', city: '', start_date: '', end_date: '', surface: '', level: '' })

  const load = async () => {
    const qs = new URLSearchParams()
    if (filter.country) qs.append('country', filter.country)
    if (filter.upcoming_only) qs.append('upcoming_only', 'true')
    const res = await fetch(`${API}/api/tournaments?${qs.toString()}`)
    setList(await res.json())
  }
  useEffect(() => { load() }, [])

  const submit = async (e) => {
    e.preventDefault()
    await fetch(`${API}/api/tournaments`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({
        ...form,
        start_date: form.start_date,
        end_date: form.end_date,
      })
    })
    setForm({ name: '', country: '', city: '', start_date: '', end_date: '', surface: '', level: '' })
    load()
  }

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-4">
        {list.map(t => (
          <div key={t._id} className="bg-slate-800/50 border border-white/10 p-4 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="text-white text-lg font-semibold">{t.name}</div>
              <div className="text-blue-300 text-sm">{t.country}{t.city?`, ${t.city}`:''}</div>
            </div>
            <div className="text-blue-200/80 text-sm">{t.start_date} → {t.end_date} • {t.surface || 'surface?'} • {t.level || ''}</div>
          </div>
        ))}
      </div>
      <div className="bg-slate-800/50 border border-white/10 p-4 rounded-xl">
        <div className="text-white font-medium mb-2">Add Tournament</div>
        <form onSubmit={submit} className="space-y-2">
          <input className="w-full px-3 py-2 rounded bg-slate-900/60 text-white border border-white/10" placeholder="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
          <div className="grid grid-cols-2 gap-2">
            <input className="px-3 py-2 rounded bg-slate-900/60 text-white border border-white/10" placeholder="Country" value={form.country} onChange={e=>setForm({...form,country:e.target.value})} />
            <input className="px-3 py-2 rounded bg-slate-900/60 text-white border border-white/10" placeholder="City" value={form.city} onChange={e=>setForm({...form,city:e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input type="date" className="px-3 py-2 rounded bg-slate-900/60 text-white border border-white/10" value={form.start_date} onChange={e=>setForm({...form,start_date:e.target.value})} />
            <input type="date" className="px-3 py-2 rounded bg-slate-900/60 text-white border border-white/10" value={form.end_date} onChange={e=>setForm({...form,end_date:e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input className="px-3 py-2 rounded bg-slate-900/60 text-white border border-white/10" placeholder="Surface" value={form.surface} onChange={e=>setForm({...form,surface:e.target.value})} />
            <input className="px-3 py-2 rounded bg-slate-900/60 text-white border border-white/10" placeholder="Level" value={form.level} onChange={e=>setForm({...form,level:e.target.value})} />
          </div>
          <button className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded px-3 py-2">Save</button>
        </form>
      </div>
    </div>
  )
}
