import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { upsertNavatarSelection } from '../../lib/navatar';
import { useNavigate, Link } from 'react-router-dom';
import CANONS from '../../data/navatarCanons'; // your working catalog

export default function PickNavatar() {
  const [selected, setSelected] = useState<{name:string,url:string}|null>(null);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  async function onSave() {
    if (!selected) return;
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Please sign in');
      await upsertNavatarSelection(user.id, selected.name, selected.url);
      alert('Saved!');
      navigate('/navatar?flash=saved');
    } catch (e:any) {
      alert(e.message || 'Error saving Navatar');
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="page">
      <nav className="breadcrumbs">
        <Link to="/">Home</Link> / <Link to="/navatar">Navatar</Link> / <span>Pick</span>
      </nav>

      <h1>Pick Navatar</h1>

      <div className="pick-layout">
        <div className="pick-grid" role="list" aria-label="Navatar catalog">
          {CANONS.map(item => (
            <button key={item.id}
              type="button"
              className={`pick-card${selected?.name === item.title ? ' selected' : ''}`}
              onClick={() => setSelected({name: item.title, url: item.url})}
            >
              <img src={item.url} alt={item.title} />
              <div className="pick-name">{item.title}</div>
            </button>
          ))}
        </div>

        <button className="btn-primary" disabled={!selected || saving} onClick={onSave}>
          {saving ? 'Saving…' : 'Pick one to save'}
        </button>
      </div>
    </main>
  );
}
