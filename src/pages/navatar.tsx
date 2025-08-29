import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { STARTER_NAVATARS } from '../data/navatars';
import { getProfile, upsertProfile } from '../lib/profile';
import NavatarPicker from '../components/NavatarPicker';
import '../styles/navatar.css';

export default function NavatarPage() {
  const { user } = useAuth();
  const nav = useNavigate();
  const [selected, setSelected] = useState<string>();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const p = await getProfile(user.id);
      if (p?.avatar_id) nav('/');
    })();
  }, [user]);

  async function save() {
    if (!user || !selected) return;
    setSaving(true);
    const svg = STARTER_NAVATARS.find(a => a.id===selected)?.svg ?? '';
    await upsertProfile({ id: user.id, avatar_id: selected, avatar_url: null });
    localStorage.setItem('navatar_id', selected);
    if (svg) localStorage.setItem('navatar_svg', svg);
    setSaving(false);
    nav('/');
  }

  return <NavatarPicker value={selected} onSelect={setSelected} onSave={save} saving={saving} />;
}
