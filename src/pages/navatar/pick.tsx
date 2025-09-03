import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CANONS from '../../data/navatarCanons';
import { supabase } from '../../lib/supabaseClient';
import '../../styles/breadcrumbs.css';
import '../../styles/navatar.css';

export default function PickNavatarPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const canon = CANONS;
  const nav = useNavigate();

  async function savePickedCanon(picked: { title: string; url: string }) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user?.id) return alert('Please sign in');
    setSaving(true);
    try {
      const payload = {
        user_id: session.user.id,
        name: picked.title,
        category: 'canon',
        method: 'pick',
        image_url: picked.url,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('avatars')
        .upsert(payload, { onConflict: 'user_id' });
      if (error) throw error;

      alert('Saved!');
      nav('/navatar');
    } catch (e: any) {
      alert(e.message ?? String(e));
    } finally {
      setSaving(false);
    }
  }

  async function handleSave() {
    if (!selected) return;
    const item = canon.find(c => c.id === selected)!;
    await savePickedCanon({ title: item.title, url: item.url });
  }

  useEffect(() => { window.scrollTo({ top: 0 }); }, []);

  return (
    <div className="container">
      <nav className="breadcrumbs"><Link to="/">Home</Link> / <Link to="/navatar">Navatar</Link> / Pick</nav>
      <h1>Pick Navatar</h1>

      <div className="nav-grid">
        {canon.map(item => (
          <button
            key={item.id}
            onClick={() => setSelected(item.id)}
            className={`nav-card ${selected===item.id ? 'isSelected': ''}`}
            style={{textAlign:'left'}}
          >
            <figure className="nav-card-figure">
              <img src={item.url} alt={item.title} loading="lazy" />
            </figure>
            <div className="nav-card-title">{item.title}</div>
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
