// src/pages/navatar.tsx
import { useEffect, useMemo, useState } from 'react'
import {
  supabaseBrowser,
  listMyAvatars,
  insertAvatar,
  deleteAvatar,
  setPrimaryAvatar,
  getUser,
  type AvatarRow,
} from '../lib/navatars'

type CanonItem = { name: string; slug: string; category: string; file: string; tags?: string[] }

function useCanon() {
  const [items, setItems] = useState<CanonItem[]>([])
  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch('/navatars/manifest.json')
        if (res.ok) {
          const json = await res.json()
          setItems(json)
        } else {
          setItems([])
        }
      } catch {
        setItems([])
      }
    })()
  }, [])
  return items
}

function NavatarCard({
  row,
  onSetPrimary,
  onDelete,
}: {
  row: AvatarRow
  onSetPrimary: () => void
  onDelete: () => void
}) {
  return (
    <div
      style={{
        borderRadius: 16,
        padding: 12,
        border: '1px solid #E3E8EF',
        background: 'white',
        width: 220,
      }}
    >
      <img
        src={row.image_url ?? ''}
        alt={row.name ?? 'navatar'}
        style={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: 12, background: '#F4F6F8' }}
      />
      <div style={{ marginTop: 8, fontWeight: 700 }}>{row.name ?? 'Untitled'}</div>
      <div style={{ fontSize: 12, opacity: 0.7 }}>{row.method} • {row.category ?? 'navatar'}</div>
      <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
        <button onClick={onSetPrimary} className="btn">Set as Profile</button>
        <button onClick={onDelete} className="btn btn-ghost">Delete</button>
      </div>
    </div>
  )
}

function CreateNavatarModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const supabase = supabaseBrowser()
  const canon = useCanon()
  const [tab, setTab] = useState<'upload' | 'generate' | 'canon'>('upload')
  const [name, setName] = useState<string>('Navatar')
  const [desc, setDesc] = useState<string>('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Upload
  async function handleUpload(file: File) {
    setError(null); setSaving(true)
    try {
      const user = await getUser()
      if (!user) throw new Error('Sign in first')
      const path = `${user.id}/${Date.now()}-${file.name}`
      const { error: upErr } = await supabase.storage.from('avatars').upload(path, file, { upsert: true })
      if (upErr) throw upErr

      const { data: pub } = supabase.storage.from('avatars').getPublicUrl(path)
      await insertAvatar({
        name,
        category: 'avatar',
        method: 'upload',
        image_url: path, // store storage path; lib will resolve to public URL
      })
      onCreated()
      onClose()
    } catch (e: any) {
      setError(e.message || 'Upload failed')
    } finally {
      setSaving(false)
    }
  }

  // Generate via OpenAI
  async function handleGenerate() {
    if (!desc.trim()) {
      setError('Describe your Navatar first'); return
    }
    setError(null); setSaving(true)
    try {
      const user = await getUser()
      if (!user) throw new Error('Sign in first')

      const res = await fetch('/.netlify/functions/generate-navatar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, name, prompt: desc }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || 'Generation failed')

      // Insert row that points to storage path we just uploaded in the function
      await insertAvatar({
        name,
        category: 'avatar',
        method: 'generate',
        image_url: json.path, // storage path (lib resolves URL)
      })
      onCreated()
      onClose()
    } catch (e: any) {
      setError(e.message || 'Generation failed')
    } finally {
      setSaving(false)
    }
  }

  // Canon
  async function pickCanon(item: CanonItem) {
    setError(null); setSaving(true)
    try {
      await insertAvatar({
        name: item.name,
        category: 'canon',
        method: 'canon',
        image_url: `/navatars/${item.file}`, // served from /public
      })
      onCreated()
      onClose()
    } catch (e: any) {
      setError(e.message || 'Could not add canon character')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,.35)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50
    }}>
      <div style={{ background: 'white', width: 'min(980px, 96vw)', borderRadius: 20, padding: 20 }}>
        <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
          <button className={tab==='upload'?'btn':'btn btn-ghost'} onClick={()=>setTab('upload')}>Upload</button>
          <button className={tab==='generate'?'btn':'btn btn-ghost'} onClick={()=>setTab('generate')}>Describe & Generate</button>
          <button className={tab==='canon'?'btn':'btn btn-ghost'} onClick={()=>setTab('canon')}>Pick Canon</button>
          <div style={{ marginLeft: 'auto' }}><button className="btn btn-ghost" onClick={onClose}>Close</button></div>
        </div>

        <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
          <input placeholder="Name (optional)" value={name} onChange={e=>setName(e.target.value)} />
          {tab==='generate' && (
            <input placeholder="Describe your Navatar (e.g., half turtle half durian, funny) "
              value={desc} onChange={e=>setDesc(e.target.value)} />
          )}
        </div>

        {error && <div style={{ color: '#b00020', marginBottom: 12 }}>{error}</div>}

        {tab==='upload' && (
          <div style={{ padding: 20, border: '1px dashed #dae0e6', borderRadius: 12 }}>
            <input type="file" accept="image/*" onChange={(e)=>{
              const f = e.target.files?.[0]; if (f) void handleUpload(f)
            }} disabled={saving}/>
            {saving && <div style={{ marginTop: 10 }}>Saving…</div>}
          </div>
        )}

        {tab==='generate' && (
          <div>
            <button className="btn" onClick={handleGenerate} disabled={saving}>{saving?'Generating…':'Generate'}</button>
          </div>
        )}

        {tab==='canon' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px,1fr))', gap: 16 }}>
            {canon.map((c)=>(
              <button key={c.slug}
                onClick={()=>pickCanon(c)}
                style={{ borderRadius: 16, border: '1px solid #e7ebf0', overflow: 'hidden', textAlign: 'left' }}>
                <img src={`/navatars/${c.file}`} alt={c.name} style={{ width:'100%', aspectRatio:'1/1', objectFit:'cover', background:'#F6F7F9' }}/>
                <div style={{ padding: 10 }}>
                  <div style={{ fontWeight: 700 }}>{c.name}</div>
                  <div style={{ fontSize: 12, opacity: .7 }}>{(c.tags||[]).slice(0,3).join(' • ')}</div>
                </div>
              </button>
            ))}
            {!canon.length && <div>Put PNGs in <code>/public/navatars</code> and list them in <code>manifest.json</code>.</div>}
          </div>
        )}
      </div>
    </div>
  )
}

export default function NavatarPage() {
  const [rows, setRows] = useState<AvatarRow[]>([])
  const [open, setOpen] = useState(false)

  async function refresh() {
    const list = await listMyAvatars()
    setRows(list)
  }

  useEffect(() => { void refresh() }, [])

  return (
    <div style={{ maxWidth: 1080, margin: '0 auto', padding: '24px 16px 64px' }}>
      <h1 style={{ textAlign: 'center', fontSize: 40, fontWeight: 800, margin: '8px 0 6px' }}>Your Navatar</h1>
      <p style={{ textAlign:'center', marginBottom: 20 }}>
        {rows.length ? 'Pick one to use as your profile.' : 'No Navatars yet — create your first!'}
      </p>
      <div style={{ display:'flex', justifyContent:'center', marginBottom: 18 }}>
        <button className="btn" onClick={()=>setOpen(true)}>Create Navatar</button>
      </div>

      {!!rows.length && (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap: 16 }}>
          {rows.map((r)=>(
            <NavatarCard key={r.id}
              row={r}
              onSetPrimary={()=>{ void setPrimaryAvatar(r).then(refresh) }}
              onDelete={()=>{ void deleteAvatar(r.id).then(refresh) }}
            />
          ))}
        </div>
      )}

      {open && <CreateNavatarModal onClose={()=>setOpen(false)} onCreated={refresh} />}
    </div>
  )
}
