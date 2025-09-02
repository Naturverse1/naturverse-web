import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { NavatarItem, saveNavatarSelection } from '../../lib/supabase/navatars';
import '../../styles/navatar.css';

export default function NavatarPick() {
  const [items, setItems] = useState<NavatarItem[]>([]);
  const [selected, setSelected] = useState<NavatarItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [ok, setOk] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    fetch('/navatar-catalog.json')
      .then(r => r.json())
      .then(j => setItems(j.items || []))
      .catch(() => setItems([]));
  }, []);

  async function onSave() {
    if (!selected) return;
    setSaving(true);
    setErr(null);
    setOk(false);
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
    <div className="pick-wrap">
      <div>
        <div className="navatar-breadcrumbs">
          <Link to="/">Home</Link> / <Link to="/navatar">Navatar</Link> / Pick
        </div>
        <h1 className="pick-title">Pick Navatar</h1>

        <div className="pick-grid" role="list" aria-label="Navatar catalog">
          {items.map(it => (
            <button
              key={it.slug}
              type="button"
              className={`pick-card ${selected?.slug === it.slug ? 'selected' : ''}`}
              onClick={() => setSelected(it)}
            >
              <img src={it.src} alt={it.label} loading="lazy" />
              <div style={{marginTop:8, fontWeight:700}}>{it.label}</div>
            </button>
          ))}
          {items.length === 0 && <div>No characters found in /public/navatars.</div>}
        </div>
      </div>

      <aside className="pick-side">
        <button className="pick-save" onClick={onSave} disabled={!selected || saving}>
          {saving ? 'Saving…' : selected ? `Save “${selected.label}”` : 'Pick one to save'}
        </button>
        {ok && <div style={{color:'#16a34a', marginTop:10}}>Saved!</div>}
        {err && <div style={{color:'#dc2626', marginTop:10}}>{err}</div>}
      </aside>
    </div>
  );
}

