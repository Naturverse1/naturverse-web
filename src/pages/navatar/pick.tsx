import { useEffect, useState } from 'react';
import '../../styles/navatar.css';
import { saveNavatarSelection } from '../../lib/supabase/navatars';

type Item = { key: string; title: string; image_url: string };

export default function NavatarPickPage() {
  const [catalog, setCatalog] = useState<Item[]>([]);
  const [selected, setSelected] = useState<Item | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/navatar-catalog.json')
      .then((r) => r.json())
      .then((data) => setCatalog(data))
      .catch(() => setCatalog([]));
  }, []);

  async function save() {
    if (!selected) return;
    setSaving(true);
    try {
      await saveNavatarSelection(selected.image_url);
      setSelected(null);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="container navatar-pick">
      <h1>Pick Navatar</h1>
      <div className="navatar-grid">
        {catalog.map((item) => (
          <button
            key={item.key}
            className={`navatar-option ${selected?.key === item.key ? 'selected' : ''}`}
            onClick={() => setSelected(item)}
          >
            <img src={item.image_url} alt={item.title} />
            <span>{item.title}</span>
          </button>
        ))}
      </div>
      {selected && (
        <button className="btn save-btn" onClick={save} disabled={saving}>
          Save
        </button>
      )}
    </div>
  );
}
