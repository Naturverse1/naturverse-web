import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getProfile, upsertProfile } from '../lib/profile';
import { STARTER_NAVATARS } from '../data/navatars';
import NavatarPicker from '../components/NavatarPicker';
import { useNavigate } from 'react-router-dom';
import '../styles/navatar.css';

export default function NavatarSetupPage() {
  const { user } = useAuth();
  const [selected, setSelected] = useState<string>();
  const [saving, setSaving] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    if (!user) return;
    getProfile(user.id).then((p) => {
      if (p?.avatar_id) {
        nav('/');
      } else if (p) {
        setSelected(p.avatar_id ?? undefined);
      }
    });
  }, [user, nav]);

  async function save() {
    if (!user || !selected) return;
    setSaving(true);
    const svg = STARTER_NAVATARS.find((a) => a.id === selected)?.svg ?? null;
    await upsertProfile({ id: user.id, avatar_id: selected, avatar_url: null });
    localStorage.setItem('navatar_id', selected);
    if (svg) localStorage.setItem('navatar_svg', svg);
    setSaving(false);
    nav('/');
  }

  return <NavatarPicker value={selected} onSelect={setSelected} onSave={save} saving={saving} />;
}
