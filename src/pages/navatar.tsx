import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { publicUrlFromPath } from '../lib/storage'

type Avatar = {
  id: string
  name: string | null
  method: 'upload' | 'canon' | 'ai'
  image_url: string | null
  appearance_data: any
}

type Tab = 'upload' | 'generate' | 'canon' | null

export default function NavatarPage() {
  const [avatars, setAvatars] = useState<Avatar[]>([])
  const [loading, setLoading] = useState(true)
  const [openTab, setOpenTab] = useState<Tab>(null)
  const [error, setError] = useState<string | null>(null)

  // Auto-catalog canon assets from /public/navatars
  const canonItems = useMemo(() => {
    // eager + as:url gives us the final asset URL at build
    const glob = import.meta.glob('/public/navatars/*.png', { eager: true, as: 'url' }) as Record<
      string,
      string
    >
    return Object.entries(glob).map(([abs, url]) => {
      const file = abs.split('/').pop()!.replace('.png', '')
      return {
        name: file,
        url,
        tags: file.toLowerCase().split(/[\s_-]+/),
      }
    })
  }, [])

  useEffect(() => {
    ;(async () => {
      const { data, error } = await supabase
        .from('avatars')
        .select('id,name,method,image_url,appearance_data')
        .order('created_at', { ascending: false })

      if (!error && data) setAvatars(data as any)
      setLoading(false)
    })()
  }, [])

  async function remove(id: string) {
    setError(null)
    const prev = avatars
    setAvatars((as) => as.filter((a) => a.id !== id))
    const { error } = await supabase.from('avatars').delete().eq('id', id)
    if (error) {
      setError(error.message)
      setAvatars(prev)
    }
  }

  // UPLOAD
  const [uploadName, setUploadName] = useState('')
  const [uploadPreview, setUploadPreview] = useState<string | null>(null)
  const [uploadFile, setUploadFile] = useState<File | null>(null)

  async function saveUpload() {
    if (!uploadFile) return
    setError(null)
    // path: user uploads into avatars/uploads
    const path = `uploads/${Date.now()}-${uploadFile.name.replace(/\s+/g, '-')}`
    const { error: upErr } = await supabase.storage
      .from('avatars')
      .upload(path, uploadFile, { upsert: false })
    if (upErr) return setError(upErr.message)

    const url = publicUrlFromPath('avatars', path)

    const { data, error: dbErr } = await supabase
      .from('avatars')
      .insert({
        name: uploadName || uploadFile.name.replace(/\.[^.]+$/, ''),
        method: 'upload',
        image_url: url,
        appearance_data: { path },
      })
      .select()
      .single()

    if (dbErr) return setError(dbErr.message)
    setAvatars((a) => [data as any, ...a])
    // reset form
    setUploadFile(null)
    setUploadPreview(null)
    setUploadName('')
    setOpenTab(null)
  }

  // GENERATE
  const [genName, setGenName] = useState('')
  const [genPrompt, setGenPrompt] = useState('')

  async function runGenerate() {
    setError(null)
    try {
      const res = await fetch('/.netlify/functions/generate-navatar', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ name: genName || 'avatar', prompt: genPrompt }),
      })
      const body = await res.json().catch(() => ({}))
      if (!res.ok) {
        return setError(body?.error || `Error ${res.status}`)
      }
      if (body?.avatar) {
        setAvatars((a) => [body.avatar, ...a])
        setGenName('')
        setGenPrompt('')
        setOpenTab(null)
      }
    } catch (e: any) {
      setError(String(e?.message || e))
    }
  }

  // CANON
  async function chooseCanon(item: { name: string; url: string }) {
    setError(null)
    const { data, error } = await supabase
      .from('avatars')
      .insert({
        name: item.name,
        method: 'canon',
        image_url: item.url,
        appearance_data: { source: 'canon', file: item.name + '.png' },
      })
      .select()
      .single()
    if (error) return setError(error.message)
    setAvatars((a) => [data as any, ...a])
    setOpenTab(null)
  }

  return (
    <div className="container" style={{ maxWidth: 960, margin: '0 auto', padding: '16px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: 8 }}>Your Navatar</h1>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
        <button className="btn" onClick={() => setOpenTab('upload')}>Create Navatar</button>
      </div>

      {error && (
        <div style={{ color: '#b00020', textAlign: 'center', marginBottom: 12 }}>
          {error}
        </div>
      )}

      {/* List */}
      {!loading && avatars.length > 0 && (
        <div style={{ display: 'grid', gap: 24, gridTemplateColumns: '1fr' }}>
          {avatars.map((a) => (
            <div key={a.id} style={{ textAlign: 'center' }}>
              {a.image_url && (
                <img
                  src={a.image_url}
                  alt={a.name || 'navatar'}
                  style={{ width: 340, maxWidth: '100%', borderRadius: 8 }}
                />
              )}
              <div style={{ marginTop: 6, fontWeight: 600 }}>{a.name || '—'}</div>
              <div style={{ fontSize: 12, opacity: 0.7 }}>{a.method.toUpperCase()}</div>
              <button className="btn small" style={{ marginTop: 8 }} onClick={() => remove(a.id)}>
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal-ish area */}
      {openTab && (
        <div style={{ marginTop: 28 }}>
          <h2 style={{ textAlign: 'center', marginBottom: 12 }}>Create Navatar</h2>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
            <button className="btn small" onClick={() => setOpenTab(null)}>✕</button>
          </div>

          {/* Tabs header */}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 12 }}>
            <button
              className={`btn ${openTab === 'upload' ? 'primary' : 'ghost'}`}
              onClick={() => setOpenTab('upload')}
            >
              Upload
            </button>
            <button
              className={`btn ${openTab === 'generate' ? 'primary' : 'ghost'}`}
              onClick={() => setOpenTab('generate')}
            >
              Describe &amp; Generate
            </button>
            <button
              className={`btn ${openTab === 'canon' ? 'primary' : 'ghost'}`}
              onClick={() => setOpenTab('canon')}
            >
              Pick Canon
            </button>
          </div>

          {/* Upload tab */}
          {openTab === 'upload' && (
            <div style={{ textAlign: 'center' }}>
              <input
                placeholder="Name (optional)"
                value={uploadName}
                onChange={(e) => setUploadName(e.target.value)}
                style={{ padding: 8, width: 260, marginBottom: 8 }}
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const f = e.target.files?.[0] || null
                  setUploadFile(f || null)
                  setUploadPreview(f ? URL.createObjectURL(f) : null)
                }}
              />
              {uploadPreview && (
                <div style={{ marginTop: 10 }}>
                  <img src={uploadPreview} style={{ maxWidth: 320, borderRadius: 8 }} />
                </div>
              )}
              <div style={{ marginTop: 10 }}>
                <button className="btn" onClick={saveUpload} disabled={!uploadFile}>
                  Save
                </button>
              </div>
            </div>
          )}

          {/* Generate tab */}
          {openTab === 'generate' && (
            <div style={{ textAlign: 'center' }}>
              <input
                placeholder="Name (optional)"
                value={genName}
                onChange={(e) => setGenName(e.target.value)}
                style={{ padding: 8, width: 260, marginBottom: 8 }}
              />
              <textarea
                placeholder="Describe your navatar..."
                value={genPrompt}
                onChange={(e) => setGenPrompt(e.target.value)}
                style={{ padding: 8, width: 320, height: 80 }}
              />
              <div style={{ marginTop: 10 }}>
                <button className="btn" onClick={runGenerate}>Generate</button>
              </div>
              <div style={{ fontSize: 12, opacity: 0.7, marginTop: 8 }}>
                If your OpenAI org isn’t verified for images, you’ll see a clear 403 message here.
              </div>
            </div>
          )}

          {/* Canon tab */}
          {openTab === 'canon' && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(220px,1fr))',
                gap: 12,
              }}
            >
              {canonItems.map((c) => (
                <button
                  key={c.url}
                  onClick={() => chooseCanon(c)}
                  style={{
                    border: 'none',
                    background: '#1f5cff',
                    color: 'white',
                    padding: 8,
                    borderRadius: 12,
                    textAlign: 'center',
                  }}
                >
                  <img
                    src={c.url}
                    alt={c.name}
                    style={{ display: 'block', width: '100%', borderRadius: 10 }}
                  />
                  <div style={{ marginTop: 6, fontWeight: 600 }}>{c.name}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
