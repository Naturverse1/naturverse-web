import { useEffect, useState } from 'react'
import { listNavatars, deleteNavatar } from '@/services/navatars'
import NavatarCreateModal from '@/components/navatar/NavatarCreateModal'
import catalog from '@/navatars/catalog.json'

export default function NavatarPage() {
  const [rows, setRows] = useState<any[]>([])
  const [open, setOpen] = useState(false)

  async function refresh() {
    const data = await listNavatars()
    setRows(data)
  }
  useEffect(() => { void refresh() }, [])

  return (
    <div className="nv-container">
      <h1 className="nv-title">Your Navatar</h1>
      <button className="nv-btn nv-btn-primary" onClick={() => setOpen(true)}>Create Navatar</button>

      <div className="nv-grid nv-grid-cols-1 md:nv-grid-cols-2 nv-gap-6 nv-mt-6">
        {rows.map(r => (
          <div key={r.id} className="nv-card nv-p-3">
            <img
              src={r.image_url}
              alt={r.name || r.method}
              onError={(e)=>{ (e.target as HTMLImageElement).src = '/img/broken-image.svg' }}
              className="nv-w-full nv-rounded-lg nv-object-cover nv-aspect-[3/4]"
              loading="lazy"
            />
            <div className="nv-mt-2 nv-text-center nv-font-medium">{r.name || r.method.toUpperCase()}</div>
            <div className="nv-mt-2 nv-flex nv-justify-center">
              <button className="nv-btn nv-btn-danger" onClick={async()=>{ await deleteNavatar(r.id); refresh() }}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {open && (
        <NavatarCreateModal
          canonCatalog={catalog}
          onClose={()=>setOpen(false)}
          onCreated={()=>refresh()}
        />
      )}
    </div>
  )
}

