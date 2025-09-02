import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCatalog, Navatar } from '../../lib/navatar';
import { saveNavatarSelection } from '../../lib/supabase';
import '../../styles/navatar.css';

export default function PickNavatar() {
  const [items, setItems] = useState<Navatar[]>([]);
  const [selected, setSelected] = useState<Navatar | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  useEffect(() => {
    const cat = getCatalog();
    setItems(cat.items || []);
  }, []);

  async function onSave() {
    if (!selected) return;
    setSaving(true);
    setError(null);
    setOk(false);
    try {
      await saveNavatarSelection(selected.label, selected.src);
      setOk(true);
    } catch (e: any) {
      setError(e?.message || 'Error saving Navatar');
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="navatar-container">
      <nav className="breadcrumbs">
        <Link to="/">Home</Link> <span>/</span>
        <Link to="/navatar">Navatar</Link> <span>/</span>
        <span>Pick</span>
      </nav>

      <h1 className="page-title">Pick Navatar</h1>

      {items.length === 0 && (
        <p className="muted">No characters found in <code>/public/navatars</code>.</p>
      )}

      <div className="pick-layout">
        <div className="pick-grid" role="list" aria-label="Navatar catalog">
          {items.map((it) => (
            <button
              type="button"
              className={`pick-card${selected?.slug === it.slug ? ' selected' : ''}`}
              key={it.slug}
              onClick={() => setSelected(it)}
            >
              <img src={it.src} alt={it.label} loading="lazy" />
            </button>
          ))}
        </div>

        <div className="pick-actions">
          <button
            className="primary"
            disabled={!selected || saving}
            onClick={onSave}
          >
            {saving ? 'Saving…' : selected ? `Save “${selected.label}”` : 'Pick one to save'}
          </button>

          {ok && <p className="ok">Saved! Head back to <Link to="/navatar">Navatar</Link>.</p>}
          {error && <p className="err">{error}</p>}
        </div>
      </div>
    </main>
  );
}
