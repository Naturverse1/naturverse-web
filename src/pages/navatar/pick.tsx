import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchNavatarCatalog, type NavatarItem } from '../../lib/navatar-storage';
import { saveNavatarSelection } from '../../lib/navatar-db';
import '../../styles/navatar.css';

export default function PickNavatarPage() {
  const [items, setItems] = useState<NavatarItem[] | null>(null);
  const [selected, setSelected] = useState<NavatarItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const list = await fetchNavatarCatalog();
        if (alive) setItems(list);
      } catch (e: any) {
        console.error(e);
        if (alive) setItems([]);
      }
    })();
    return () => { alive = false; };
  }, []);

  async function onSave() {
    if (!selected) return;
    setSaving(true);
    setError(null);
    try {
      await saveNavatarSelection(selected.label, selected.src);
      alert('Saved!');
    } catch (e: any) {
      console.error(e);
      setError(e?.message || 'Error saving Navatar');
      alert('Error saving Navatar');
    } finally {
      setSaving(false);
    }
  }

  const empty = items && items.length === 0;

  return (
    <div className="pick-wrap">
      <nav className="breadcrumbs">
        <Link to="/">Home</Link>
        <span>/</span>
        <Link to="/navatar">Navatar</Link>
        <span>/</span>
        <span>Pick</span>
      </nav>

      <h1 className="page-title">Pick Navatar</h1>

      {items === null && <div className="pick-status">Loading…</div>}

      {empty && (
        <div className="pick-status">
          No characters found in <code>/storage/navatars/navatars</code>.
        </div>
      )}

      {items && items.length > 0 && (
        <div className="pick-layout">
          <div className="pick-grid" role="list" aria-label="Navatar catalog">
            {items.map((it) => (
              <button
                key={it.slug}
                type="button"
                className={'pick-card' + (selected?.slug === it.slug ? ' selected' : '')}
                onClick={() => setSelected(it)}
                title={it.label}
              >
                <img loading="lazy" src={it.src} alt={it.label} />
                <div className="pick-name">{it.label}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="pick-actions">
        <button
          className="primary"
          disabled={!selected || saving}
          onClick={onSave}
          aria-disabled={!selected || saving}
        >
          {saving ? 'Saving…' : (selected ? `Save “${selected.label}”` : 'Pick one to save')}
        </button>
      </div>

      {error && <div className="pick-error" role="alert">{error}</div>}
    </div>
  );
}
