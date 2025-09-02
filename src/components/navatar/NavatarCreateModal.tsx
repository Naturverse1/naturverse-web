import { useEffect, useMemo, useRef, useState } from 'react'
import { createFromUpload, createFromCanon, createFromAI } from '@/services/navatars'

type Mode = 'upload' | 'ai' | 'canon'

export default function NavatarCreateModal({
  onClose,
  onCreated,
  canonCatalog,
}: {
  onClose: () => void
  onCreated: (row: any) => void
  canonCatalog: { name: string; image_url: string; tags?: string[] }[]
}) {
  const [mode, setMode] = useState<Mode>('upload')
  const [file, setFile] = useState<File | null>(null)
  const [name, setName] = useState('')
  const [prompt, setPrompt] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [canonIdx, setCanonIdx] = useState<number | null>(null)

  // Clear other fields when switching modes
  useEffect(() => {
    setError(null)
    if (mode !== 'upload') setFile(null)
    if (mode !== 'ai') setPrompt('')
    if (mode !== 'canon') setCanonIdx(null)
  }, [mode])

  async function handleSave() {
    try {
      setBusy(true); setError(null)
      if (mode === 'upload') {
        if (!file) throw new Error('Choose a file first')
        const row = await createFromUpload(file, name)
        onCreated(row)
      } else if (mode === 'ai') {
        if (!prompt.trim()) throw new Error('Describe your Navatar')
        const row = await createFromAI(prompt, name)
        onCreated(row)
      } else {
        if (canonIdx == null) throw new Error('Pick a canon')
        const row = await createFromCanon(canonCatalog[canonIdx].image_url, name)
        onCreated(row)
      }
      onClose()
    } catch (e: any) {
      setError(e.message || 'Something went wrong')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div aria-modal className="nv-fixed nv-inset-0 nv-z-50 nv-flex nv-items-center nv-justify-center">
      <div className="nv-absolute nv-inset-0 nv-bg-black/40" onClick={() => !busy && onClose()} />
      <div className="nv-relative nv-w-[min(960px,96vw)] nv-max-h-[92vh] nv-bg-white nv-rounded-2xl nv-shadow-xl nv-overflow-hidden">
        {/* Header */}
        <div className="nv-flex nv-items-center nv-justify-between nv-gap-2 nv-p-4 nv-border-b">
          <h3 className="nv-text-lg nv-font-semibold">Create Navatar</h3>
          <button className="nv-btn nv-btn-ghost" onClick={() => !busy && onClose()}>✕</button>
        </div>

        {/* Tabs */}
        <div className="nv-flex nv-gap-2 nv-px-4 nv-pt-3">
          <button
            className={`nv-tab ${mode==='upload'?'nv-tab-active':''}`}
            onClick={()=>setMode('upload')}
            disabled={busy}
          >Upload</button>
          <button
            className={`nv-tab ${mode==='ai'?'nv-tab-active':''}`}
            onClick={()=>setMode('ai')}
            disabled={busy}
          >Describe & Generate</button>
          <button
            className={`nv-tab ${mode==='canon'?'nv-tab-active':''}`}
            onClick={()=>setMode('canon')}
            disabled={busy}
          >Pick Canon</button>
          <input
            className="nv-ml-auto nv-input nv-w-64"
            placeholder="Name (optional)"
            value={name}
            onChange={e=>setName(e.target.value)}
            disabled={busy}
          />
        </div>

        {/* Body (scrollable) */}
        <div className="nv-p-4 nv-overflow-auto nv-max-h-[calc(92vh-160px)]">
          {mode === 'upload' && (
            <div className="nv-flex nv-flex-col nv-gap-3 nv-items-start">
              <input type="file" accept="image/*" onChange={e=>setFile(e.target.files?.[0]||null)} />
              {file && (
                <img
                  src={URL.createObjectURL(file)}
                  alt="preview"
                  className="nv-w-[320px] nv-rounded-lg nv-shadow"
                />
              )}
            </div>
          )}

          {mode === 'ai' && (
            <div className="nv-flex nv-flex-col nv-gap-3">
              <textarea
                className="nv-textarea"
                placeholder="e.g., friendly turtle wearing headphones…"
                value={prompt}
                onChange={e=>setPrompt(e.target.value)}
                rows={5}
                disabled={busy}
              />
              <p className="nv-text-sm nv-text-gray-500">
                If your OpenAI project isn’t verified for images, you’ll get a clear error here.
              </p>
            </div>
          )}

          {mode === 'canon' && (
            <div className="nv-grid nv-grid-cols-2 md:nv-grid-cols-3 lg:nv-grid-cols-4 nv-gap-3">
              {canonCatalog.map((c, i) => (
                <button
                  key={c.name}
                  className={`nv-card ${canonIdx===i?'nv-card-active':''}`}
                  onClick={()=>setCanonIdx(i)}
                  disabled={busy}
                  title={c.name}
                >
                  <img src={c.image_url} alt={c.name} className="nv-w-full nv-rounded-md nv-object-cover nv-aspect-[3/4]" />
                  <div className="nv-mt-1 nv-text-sm nv-font-medium nv-text-center">{c.name}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer (sticky in modal) */}
        <div className="nv-sticky nv-bottom-0 nv-bg-white nv-border-t nv-p-4 nv-flex nv-justify-between nv-items-center">
          <span className="nv-text-sm nv-text-red-600">{error}</span>
          <button className="nv-btn nv-btn-primary" onClick={handleSave} disabled={busy}>
            {busy ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  )
}

