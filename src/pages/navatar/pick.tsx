import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CANONS from '../../data/navatarCanons';
import { getSupabase } from '../../lib/supabase';
import { useSession } from '../../lib/session';
import '../../styles/navatar.css';

export default function PickNavatarPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const canon = CANONS;
  const navigate = useNavigate();
  const user = useSession();
  const supabase = getSupabase();

  async function savePickedCanon(pickedCanon: { title: string; url: string }) {
    if (!user?.id) {
      alert('Please sign in');
      return;
    }
    try {
      setSaving(true);
      const { error } = await supabase.from('avatars').upsert(
        {
          user_id: user.id,
          name: pickedCanon.title,
          category: 'canon',
          method: 'pick',
          image_url: pickedCanon.url,
        },
        { onConflict: 'user_id', ignoreDuplicates: false }
      );
      if (error) throw error;
      navigate('/navatar?refresh=1');
    } catch (e: any) {
      alert(e?.message ?? 'Could not save. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  function handleSave() {
    if (!selected) return;
    const item = canon.find(c => c.id === selected)!;
    savePickedCanon({ title: item.title, url: item.url });
  }

  useEffect(() => { window.scrollTo({ top: 0 }); }, []);

  return (
    <div className="container">
      <nav className="nv-breadcrumbs brand-blue">
        <Link to="/">Home</Link>
        <span className="sep">/</span>
        <Link to="/navatar">Navatar</Link>
        <span className="sep">/</span>
        <span>Pick</span>
      </nav>
      <h1>Pick Navatar</h1>

      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(200px,1fr))', gap:20}}>
        {canon.map(item => (
          <button
            key={item.id}
            onClick={() => setSelected(item.id)}
            className={`card ${selected===item.id ? 'isSelected': ''}`}
            style={{textAlign:'left'}}
          >
            <div className="navatar-card">
              <img src={item.url} alt={item.title} />
            </div>
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
