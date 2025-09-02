import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { saveNavatarSelection } from '../../lib/navatar';
import '../../styles/navatar.css';

type Item = { label: string; slug: string; src: string };

export default function PickNavatar() {
  const [items, setItems] = useState<Item[]>([]);
  const [selected, setSelected] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch('/navatars/catalog.json', { cache: 'no-store' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: Item[] = await res.json();
        if (!alive) return;
        setItems(data);
      } catch (e: any) {
        if (!alive) return;
        setError('No characters found in /public/navatars.');
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  const onSave = async () => {
    if (!selected) return;
    setSaving(true);
    setError(null);
    try {
      await saveNavatarSelection(selected.label, selected.src);
      alert(`Saved “${selected.label}” as your Navatar`);
    } catch (e: any) {
      setError(e?.message || 'Error saving Navatar');
      alert('Error saving Navatar');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="navatar-page">
      <nav className="breadcrumbs">
        <Link to="/">Home</Link> <span>/</span> <Link to="/navatar">Navatar</Link> <span>/</span> <span>Pick</span>
      </nav>

      <h1 className="page-title">Pick Navatar</h1>

      {error && <p className="error">{error}</p>}

      {loading ? (
        <p className="muted">Loading…</p>
      ) : items.length === 0 ? (
        <p className="muted">No characters found in <code>/public/navatars</code>.</p>
      ) : (
        <div className="pick-layout">
          <ul className="pick-grid" role="list" aria-label="Navatar catalog">
            {items.map((it) => (
              <li key={it.slug}>
                <button
                  type="button"
                  className={`pick-card ${selected?.slug === it.slug ? 'selected' : ''}`}
                  onClick={() => setSelected(it)}
                >
                  <img src={it.src} alt={it.label} loading="lazy" />
                  <span className="pick-name">{it.label}</span>
                </button>
              </li>
            ))}
          </ul>

          <div className="pick-actions">
            <button
              className="primary"
              disabled={!selected || saving}
              onClick={onSave}
              aria-busy={saving || undefined}
            >
              {saving ? 'Saving…' : selected ? `Save “${selected.label}”` : 'Pick one to save'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
