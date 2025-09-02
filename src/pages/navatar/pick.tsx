import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listPublicNavatars, saveNavatarSelection, type NavatarItem } from '../../lib/navatar-supabase';
import '../../styles/navatar.css';

export default function PickNavatar() {
  const [items, setItems] = useState<NavatarItem[]>([]);
  const [selected, setSelected] = useState<NavatarItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const list = await listPublicNavatars();
      if (mounted) setItems(list);
    })();
    return () => { mounted = false; };
  }, []);

  async function onSave() {
    if (!selected) return;
    setSaving(true); setErr(null); setOk(false);
    try {
      await saveNavatarSelection(selected.label, selected.src);
      setOk(true);
    } catch (e: any) {
      setErr(e?.message || 'Error saving Navatar');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="navatar-wrap">
      <nav className="breadcrumbs">
        <Link to="/">Home</Link> <span>/</span>
        <Link to="/navatar">Navatar</Link> <span>/</span>
        <span>Pick</span>
      </nav>

      <h1 className="page-title">Pick Navatar</h1>

      {items.length === 0 ? (
        <p className="empty">No characters found in <code>navatars</code> storage bucket.</p>
      ) : (
        <div className="pick-layout">
          <div className="pick-grid" role="list" aria-label="Navatar catalog">
            {items.map(it => (
              <button
                key={it.slug}
                className={`pick-card${selected?.slug === it.slug ? ' selected' : ''}`}
                type="button"
                onClick={() => setSelected(it)}
                aria-pressed={selected?.slug === it.slug}
                title={it.label}
              >
                <img src={it.src} alt={it.label} loading="lazy" />
                <span className="label">{it.label}</span>
              </button>
            ))}
          </div>

          <div className="actions">
            {!!err && <div className="notice err">{err}</div>}
            {ok && <div className="notice ok">Saved! Return to <Link to="/navatar">Navatar</Link>.</div>}
            <button className="primary" type="button" disabled={!selected || saving} onClick={onSave}>
              {saving ? 'Saving…' : selected ? `Save “${selected.label}”` : 'Pick one to save'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
