import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import catalog from '../../data/navatar-catalog.json';
import { saveNavatarSelection } from '../../lib/avatars';
import '../../styles/navatar.css';

type Item = { label: string; slug: string; src: string };

export default function PickNavatar() {
  const items = useMemo<Item[]>(
    () => Array.isArray(catalog) ? catalog : [],
    []
  );

  const [selected, setSelected] = useState<Item | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Guard against white screens if catalog is empty
  useEffect(() => {
    // no-op, but keeps a render after build step
  }, []);

  async function onSave() {
    if (!selected) return;
    setSaving(true);
    setError(null);
    try {
      await saveNavatarSelection(selected);
      alert('Saved!');
    } catch (e: any) {
      setError(e?.message ?? 'Error saving Navatar');
      alert('Error saving Navatar');
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="navatar-wrap">
      <nav className="breadcrumbs">
        <Link to="/">Home</Link> <span>/</span>
        <Link to="/navatar">Navatar</Link> <span>/</span>
        <span>Pick</span>
      </nav>

      <h1 className="page-title">Pick Navatar</h1>

      {items.length === 0 ? (
        <p className="muted">No characters found in <code>/public/navatars</code>.</p>
      ) : (
        <div className="pick-grid" role="list" aria-label="Navatar catalog">
          {items.map(it => (
            <button
              key={it.slug}
              type="button"
              className={`pick-card ${selected?.slug === it.slug ? 'selected' : ''}`}
              onClick={() => setSelected(it)}
            >
              <img src={it.src} alt={it.label} loading="lazy" />
              <span className="pick-label">{it.label}</span>
            </button>
          ))}
        </div>
      )}

      <div className="pick-actions">
        <button
          className="save-btn"
          disabled={!selected || saving}
          onClick={onSave}
        >
          {saving ? 'Saving…' : 'Pick one to save'}
        </button>
      </div>

      {error && <p className="error-text">{error}</p>}
    </main>
  );
}
