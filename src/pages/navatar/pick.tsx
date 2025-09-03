import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import catalog from '../../data/navatar-catalog.json';
import { saveNavatarSelection } from '../../lib/avatars';
import '../../styles/navatar.css';

type Item = { id: string; title: string; slug: string; src: string };

export default function PickNavatar() {
  const navigate = useNavigate();
  const [items, setItems] = useState<Item[]>([]);
  const [selected, setSelected] = useState<Item | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setItems((catalog as Item[]) || []);
  }, []);

  async function onSave() {
    if (!selected) return;
    setSaving(true);
    setError(null);
    try {
      await saveNavatarSelection(selected.title, selected.src);
      alert('Saved!');
      navigate('/navatar');
    } catch (e: any) {
      const msg = e?.message || 'Error saving Navatar';
      setError(msg);
      alert(msg);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="pick-wrap">
      <div className="breadcrumbs">
        <Link to="/">Home</Link> <span>/</span> <Link to="/navatar">Navatar</Link> <span>/</span> <span>Pick</span>
      </div>

      <h1 className="page-title">Pick Navatar</h1>

      {items.length === 0 && (
        <p className="muted">No characters found in <code>/public/navatars</code>.</p>
      )}

      <div className="pick-layout">
        <div className="pick-grid" role="list" aria-label="Navatar catalog">
          {items.map(it => (
            <button
              key={it.id}
              type="button"
              className={`pick-card ${selected?.id === it.id ? 'selected' : ''}`}
              onClick={() => setSelected(it)}
              title={it.title}
            >
              <img loading="lazy" src={it.src} alt={it.title} />
              <div className="pick-name">{it.title}</div>
            </button>
          ))}
        </div>

        <div className="pick-side">
          <button className="save-btn" disabled={!selected || saving} onClick={onSave}>
            {selected ? (saving ? 'Saving…' : `Save “${selected.title}”`) : 'Pick one to save'}
          </button>
          {error && <div className="error">{error}</div>}
        </div>
      </div>
    </div>
  );
}

