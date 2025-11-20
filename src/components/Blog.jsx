import { useEffect, useState } from 'react'

const API = import.meta.env.VITE_BACKEND_URL

export default function Blog() {
  const [posts, setPosts] = useState([])
  const [form, setForm] = useState({ title: '', content: '', author_name: '', tags: '' })
  const [loading, setLoading] = useState(false)

  const load = async () => {
    try {
      const res = await fetch(`${API}/api/blogs`)
      const data = await res.json()
      setPosts(data)
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => { load() }, [])

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch(`${API}/api/blogs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          content: form.content,
          author_name: form.author_name,
          tags: form.tags.split(',').map(s => s.trim()).filter(Boolean),
          published: true,
        })
      })
      if (!res.ok) throw new Error('Failed')
      setForm({ title: '', content: '', author_name: '', tags: '' })
      await load()
    } catch (e) {
      alert('Error creating post')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-4">
        {posts.map(p => (
          <div key={p._id} className="bg-slate-800/50 border border-white/10 p-4 rounded-xl">
            <div className="text-white text-lg font-semibold">{p.title}</div>
            <div className="text-blue-300 text-sm">By {p.author_name}</div>
            <p className="text-blue-200/80 mt-2 whitespace-pre-wrap">{p.content}</p>
            {p.tags?.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {p.tags.map(t => (
                  <span key={t} className="px-2 py-0.5 text-xs rounded bg-blue-600/20 text-blue-200 border border-blue-500/30">#{t}</span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="bg-slate-800/50 border border-white/10 p-4 rounded-xl">
        <div className="text-white font-medium mb-2">New Post</div>
        <form onSubmit={submit} className="space-y-2">
          <input className="w-full px-3 py-2 rounded bg-slate-900/60 text-white border border-white/10" placeholder="Title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} />
          <input className="w-full px-3 py-2 rounded bg-slate-900/60 text-white border border-white/10" placeholder="Author" value={form.author_name} onChange={e=>setForm({...form,author_name:e.target.value})} />
          <textarea className="w-full px-3 py-2 rounded bg-slate-900/60 text-white border border-white/10" rows={5} placeholder="Content" value={form.content} onChange={e=>setForm({...form,content:e.target.value})} />
          <input className="w-full px-3 py-2 rounded bg-slate-900/60 text-white border border-white/10" placeholder="Tags (comma separated)" value={form.tags} onChange={e=>setForm({...form,tags:e.target.value})} />
          <button disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded px-3 py-2">{loading? 'Saving...' : 'Publish'}</button>
        </form>
      </div>
    </div>
  )
}
