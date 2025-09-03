import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumbs from '../../components/Breadcrumbs';
import CANONS from '../../data/navatarCanons';
import { getSupabase } from '../../lib/supabase';
import { useSession } from '../../lib/session';
import './Navatar.css';

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
          method: 'system',
          status: 'ready',
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
    <div className="nv-Page">
      <Breadcrumbs items={[{ href: '/', label: 'Home' }, { href: '/navatar', label: 'Navatar' }, { label: 'Pick' }]} />
      <h1>Pick Navatar</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px,1fr))', gap: 20 }}>
        {canon.map(item => (
          <button
            key={item.id}
            onClick={() => setSelected(item.id)}
            className={`nv-Card ${selected === item.id ? 'isSelected' : ''}`}
            style={{ textAlign: 'left' }}
          >
            {item.url ? (
              <img className="nv-Img" src={item.url} alt={item.title} onError={e => (e.currentTarget.src = '/navatars/seedling.svg')} />
            ) : (
              <div className="nv-Img" style={{ background: '#f1f2f5' }} />
            )}
            <div style={{ fontWeight: 700, marginTop: 8 }}>{item.title}</div>
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
        <button
          className="nv-PrimaryBtn"
          disabled={!selected || saving}
          onClick={handleSave}
        >
          {saving ? 'Saving…' : 'Pick one to save'}
        </button>
      </div>
    </div>
  );
}
