import { FormEvent, useEffect, useState } from 'react';
import { useAuth } from '../../lib/auth-context';
import NavatarBreadcrumbs from '../../components/NavatarBreadcrumbs';
import '../../styles/navatar.css';
import { getMyActiveAvatar, upsertCharacterCard } from '../../lib/navatar';

export default function CharacterCardPage() {
  const { user } = useAuth();
  const [avatarId, setAvatarId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', species: '', kingdom: '', backstory: '', powers: '', traits: '' });

  useEffect(() => {
    if (!user) return;
    getMyActiveAvatar(user!.id).then(a => setAvatarId(a?.id ?? null));
  }, [user]);

  if (!user) return <div className="navatar-shell"><p>Please sign in.</p></div>;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!avatarId) { alert('Please pick or upload a Navatar first.'); return; }

    await upsertCharacterCard({
      user_id: user!.id,
      avatar_id: avatarId,
      name: form.name || null,
      species: form.species || null,
      kingdom: form.kingdom || null,
      backstory: form.backstory || null,
      powers: form.powers ? form.powers.split(',').map(s => s.trim()).filter(Boolean) : [],
      traits: form.traits ? form.traits.split(',').map(s => s.trim()).filter(Boolean) : []
    } as any);

    alert('Saved!');
  }

  function bind(k: keyof typeof form) {
    return {
      value: form[k],
      onChange: (e: any) => setForm((f) => ({ ...f, [k]: e.target.value }))
    };
  }

  return (
    <div className="navatar-shell">
      <NavatarBreadcrumbs />
      <h1>Character Card</h1>

      <form className="center" onSubmit={onSubmit}>
        <input placeholder="Name" {...bind('name')} />
        <br />
        <input placeholder="Species / Type" {...bind('species')} />
        <br />
        <input placeholder="Kingdom" {...bind('kingdom')} />
        <br />
        <textarea placeholder="Backstory" {...bind('backstory')} />
        <br />
        <input placeholder="Powers (comma separated)" {...bind('powers')} />
        <br />
        <input placeholder="Traits (comma separated)" {...bind('traits')} />
        <br />
        <button className="pill" type="submit">Save</button>
      </form>
    </div>
  );
}
