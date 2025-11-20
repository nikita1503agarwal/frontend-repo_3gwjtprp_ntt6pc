import { useEffect, useState } from 'react'

const API = import.meta.env.VITE_BACKEND_URL

export default function Trainers() {
  const [list, setList] = useState([])
  const [country, setCountry] = useState('')
  const [form, setForm] = useState({ name: '', country: '', city: '', languages: '', hourly_rate: '', bio: '' })
  const [booking, setBooking] = useState({ trainer_id: '', user_name: '', user_email: '', session_date: '', duration_hours: 1, notes: '' })

  const load = async () => {
    const qs = new URLSearchParams()
    if (country) qs.append('country', country)
    const res = await fetch(`${API}/api/trainers?${qs.toString()}`)
    setList(await res.json())
  }
  useEffect(() => { load() }, [country])

  const addTrainer = async (e) => {
    e.preventDefault()
    await fetch(`${API}/api/trainers`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({
        ...form,
        languages: form.languages.split(',').map(s=>s.trim()).filter(Boolean),
        hourly_rate: Number(form.hourly_rate || 0)
      })
    })
    setForm({ name: '', country: '', city: '', languages: '', hourly_rate: '', bio: '' })
    load()
  }

  const book = async (e) => {
    e.preventDefault()
    const payload = {
      ...booking,
      duration_hours: Number(booking.duration_hours)
    }
    const res = await fetch(`${API}/api/bookings`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    if (res.ok) {
      alert('Booking requested! The trainer will confirm shortly.')
      setBooking({ trainer_id: '', user_name: '', user_email: '', session_date: '', duration_hours: 1, notes: '' })
    } else {
      const err = await res.json().catch(()=>({detail:'Error'}))
      alert(err.detail || 'Error creating booking')
    }
  }

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-4">
        <div className="flex items-center gap-2">
          <input value={country} onChange={e=>setCountry(e.target.value)} placeholder="Filter by country" className="px-3 py-2 rounded bg-slate-900/60 text-white border border-white/10" />
          <button onClick={load} className="px-3 py-2 rounded bg-blue-600 text-white">Search</button>
        </div>
        {list.map(t => (
          <div key={t._id} className="bg-slate-800/50 border border-white/10 p-4 rounded-xl">
            <div className="flex justify-between">
              <div>
                <div className="text-white text-lg font-semibold">{t.name}</div>
                <div className="text-blue-300 text-sm">{t.city ? `${t.city}, `: ''}{t.country} • ${t.hourly_rate}/hr</div>
                {t.languages?.length>0 && <div className="text-blue-200/80 text-xs">Languages: {t.languages.join(', ')}</div>}
                {t.bio && <p className="text-blue-200/80 mt-2 text-sm">{t.bio}</p>}
              </div>
              <button onClick={()=>setBooking(b=>({...b, trainer_id: t._id}))} className="h-10 px-3 bg-blue-600 text-white rounded">Book</button>
            </div>
          </div>
        ))}
      </div>
      <div className="space-y-6">
        <div className="bg-slate-800/50 border border-white/10 p-4 rounded-xl">
          <div className="text-white font-medium mb-2">List as Trainer</div>
          <form onSubmit={addTrainer} className="space-y-2">
            <input className="w-full px-3 py-2 rounded bg-slate-900/60 text-white border border-white/10" placeholder="Full name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
            <div className="grid grid-cols-2 gap-2">
              <input className="px-3 py-2 rounded bg-slate-900/60 text-white border border-white/10" placeholder="Country" value={form.country} onChange={e=>setForm({...form,country:e.target.value})} />
              <input className="px-3 py-2 rounded bg-slate-900/60 text-white border border-white/10" placeholder="City" value={form.city} onChange={e=>setForm({...form,city:e.target.value})} />
            </div>
            <input className="w-full px-3 py-2 rounded bg-slate-900/60 text-white border border-white/10" placeholder="Languages (comma separated)" value={form.languages} onChange={e=>setForm({...form,languages:e.target.value})} />
            <input type="number" min="0" step="0.01" className="w-full px-3 py-2 rounded bg-slate-900/60 text-white border border-white/10" placeholder="Hourly rate (USD)" value={form.hourly_rate} onChange={e=>setForm({...form,hourly_rate:e.target.value})} />
            <textarea className="w-full px-3 py-2 rounded bg-slate-900/60 text-white border border-white/10" rows={3} placeholder="Short bio" value={form.bio} onChange={e=>setForm({...form,bio:e.target.value})} />
            <button className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded px-3 py-2">Publish</button>
          </form>
        </div>

        <div className="bg-slate-800/50 border border-white/10 p-4 rounded-xl">
          <div className="text-white font-medium mb-2">Book a Trainer</div>
          <form onSubmit={book} className="space-y-2">
            <select className="w-full px-3 py-2 rounded bg-slate-900/60 text-white border border-white/10" value={booking.trainer_id} onChange={e=>setBooking({...booking,trainer_id:e.target.value})}>
              <option value="">Select trainer</option>
              {list.map(t=> <option key={t._id} value={t._id}>{t.name} — {t.country}</option>)}
            </select>
            <input className="w-full px-3 py-2 rounded bg-slate-900/60 text-white border border-white/10" placeholder="Your name" value={booking.user_name} onChange={e=>setBooking({...booking,user_name:e.target.value})} />
            <input type="email" className="w-full px-3 py-2 rounded bg-slate-900/60 text-white border border-white/10" placeholder="Email" value={booking.user_email} onChange={e=>setBooking({...booking,user_email:e.target.value})} />
            <input type="datetime-local" className="w-full px-3 py-2 rounded bg-slate-900/60 text-white border border-white/10" value={booking.session_date} onChange={e=>setBooking({...booking,session_date:e.target.value})} />
            <input type="number" min="0.5" step="0.5" className="w-full px-3 py-2 rounded bg-slate-900/60 text-white border border-white/10" placeholder="Duration (hrs)" value={booking.duration_hours} onChange={e=>setBooking({...booking,duration_hours:e.target.value})} />
            <textarea className="w-full px-3 py-2 rounded bg-slate-900/60 text-white border border-white/10" rows={3} placeholder="Notes (optional)" value={booking.notes} onChange={e=>setBooking({...booking,notes:e.target.value})} />
            <button className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded px-3 py-2">Request Booking</button>
          </form>
        </div>
      </div>
    </div>
  )
}
