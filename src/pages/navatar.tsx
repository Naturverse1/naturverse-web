import { useEffect, useState } from 'react';
import canon from '../data/navatar-canon.json';
import { saveCanonNavatar } from '../lib/navatar';
import './navatar.css';

type Item = { slug: string; name: string; src: string };

export default function NavatarPage() {
  const items = (canon?.items ?? []) as Item[];
  const [modalOpen, setModalOpen] = useState(false);
  const [tab, setTab] = useState<'upload'|'generate'|'canon'>('upload');
  const [selected, setSelected] = useState<Item | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Ensure body doesn’t scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = modalOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [modalOpen]);

  async function onSaveCanon() {
    if (!selected) return;
    try {
      setSaving(true); setError(null);
      await saveCanonNavatar({ name: selected.name, src: selected.src });
      setModalOpen(false);
      // Optional: refresh or toast; keeping simple here
    } catch (e: any) {
      setError(e?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="nv-wrap">
      <h1 className="nv-title">Your Navatar</h1>

      <button className="nv-cta" onClick={() => { setModalOpen(true); setTab('upload'); }}>
        Create Navatar
      </button>

      {modalOpen && (
        <div className="nv-modal">
          <div className="nv-card">
            <div className="nv-card-head">
              <div className="nv-card-title">Create Navatar</div>
              <button className="nv-close" onClick={() => setModalOpen(false)}>×</button>
            </div>

            <div className="nv-tabs">
              <button className={`nv-tab ${tab==='upload'?'is-active':''}`} onClick={()=>setTab('upload')}>Upload</button>
              <button className={`nv-tab ${tab==='generate'?'is-active':''}`} onClick={()=>setTab('generate')}>Describe &amp; Generate</button>
              <button className={`nv-tab ${tab==='canon'?'is-active':''}`} onClick={()=>setTab('canon')}>Pick Canon</button>
            </div>

            {tab === 'upload' && (
              <div className="nv-pane muted">
                <p>Upload stays as-is (we’ll wire this next).</p>
              </div>
            )}

            {tab === 'generate' && (
              <div className="nv-pane muted">
                <p>AI Generate stays as-is (we’ll wire this after upload).</p>
              </div>
            )}

            {tab === 'canon' && (
              <div className="nv-pane">
                <p className="nv-slogan">Become one with nature — pick a canon Navatar.</p>
                <div className="nv-grid" role="list">
                  {items.map(it => (
                    <button
                      key={it.slug}
                      className={`nv-card-item ${selected?.slug===it.slug ? 'is-selected' : ''}`}
                      onClick={() => setSelected(it)}
                      role="listitem"
                      aria-pressed={selected?.slug===it.slug}
                    >
                      <img src={it.src} alt={it.name} loading="lazy" />
                      <div className="nv-name">{it.name}</div>
                    </button>
                  ))}
                </div>

                <div className="nv-actions">
                  <button
                    className="nv-save"
                    onClick={onSaveCanon}
                    disabled={!selected || saving}
                  >
                    {saving ? 'Saving…' : selected ? `Save “${selected.name}”` : 'Pick one to save'}
                  </button>
                  {error && <div className="nv-error">{error}</div>}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
