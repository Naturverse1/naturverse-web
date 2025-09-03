import { useEffect, useState } from 'react';
import CANONS from '../../data/navatarCanons';
import { upsertMyAvatar } from '../../lib/avatars';
import '../../styles/navatar.css';

export default function PickNavatarPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const canon = CANONS;

  async function handleSave() {
    if (!selected) return;
    const item = canon.find(c => c.id === selected)!;
    setSaving(true);
    try {
      await upsertMyAvatar({
        name: item.title,
        category: 'canon',
        method: 'pick',
        image_url: item.url
      });
      alert('Saved!');
      window.location.assign('/navatar');
    } catch (e: any) {
      alert(e?.message ?? 'Could not save. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => { window.scrollTo({ top: 0 }); }, []);

  return (
    <div className="container">
      <nav className="crumbs">Home / Navatar / Pick</nav>
      <h1>Pick Navatar</h1>

      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(200px,1fr))', gap:20}}>
        {canon.map(item => (
          <button
            key={item.id}
            onClick={() => setSelected(item.id)}
            className={`card ${selected===item.id ? 'isSelected': ''}`}
            style={{textAlign:'left'}}
          >
            <img src={item.url} alt={item.title} className="thumb"/>
            <div className="title">{item.title}</div>
          </button>
        ))}
      </div>

      <div style={{display:'flex', justifyContent:'flex-end', marginTop:16}}>
        <button className="primary"
          disabled={!selected || saving}
          onClick={handleSave}>
          {saving ? 'Saving…' : 'Pick one to save'}
        </button>
      </div>
    </div>
  );
}
