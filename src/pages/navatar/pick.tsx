import { useEffect, useState } from 'react';
import CANONS, { Canon } from '../../data/navatarCanons';
import { supabase } from '@/lib/supabaseClient';
import { Link } from 'react-router-dom';
import '../../styles/navatar.css';

async function savePickedCanon(picked: { title: string; url: string }) {
  const {
    data: { session },
    error: sessErr,
  } = await supabase.auth.getSession();
  if (sessErr || !session?.user?.id) {
    alert('Please sign in');
    return;
  }

  const userId = session.user.id;

  const payload = {
    user_id: userId,
    name: picked.title,
    category: 'canon',
    method: 'pick',
    image_url: picked.url,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from('avatars')
    .upsert(payload, { onConflict: 'user_id' });

  if (error) {
    alert(error.message);
    return;
  }

  alert('Saved!');
  window.location.href = '/navatar';
}

export default function PickNavatarPage() {
  const [selected, setSelected] = useState<Canon | null>(null);
  const [saving, setSaving] = useState(false);
  const canon = CANONS;

  useEffect(() => { window.scrollTo({ top: 0 }); }, []);

  async function handleSave() {
    if (!selected) return;
    setSaving(true);
    await savePickedCanon(selected);
    setSaving(false);
  }

  return (
    <div className="container">
      <nav className="crumbs"><Link to="/">Home</Link> / <Link to="/navatar">Navatar</Link> / Pick</nav>
      <h1>Pick Navatar</h1>

      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(200px,1fr))', gap:20}}>
        {canon.map(item => (
          <button
            key={item.id}
            onClick={() => setSelected(item)}
            className={`navatar-card ${selected?.id === item.id ? 'isSelected': ''}`}
            style={{textAlign:'left'}}
          >
            <img src={item.url} alt={item.title} />
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
