import { useState } from 'react';
import { saveCharacterCard } from '../../lib/supabaseAvatar';

export default function CharacterCardPage() {
  const [form, setForm] = useState({ name:'', species:'', kingdom:'', backstory:'', powers:'', traits:'' });
  const [busy, setBusy] = useState(false);

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setBusy(true);
      await saveCharacterCard({
        name: form.name || undefined,
        species: form.species || undefined,
        kingdom: form.kingdom || undefined,
        backstory: form.backstory || undefined,
        powers: form.powers ? form.powers.split(',').map(s=>s.trim()) : [],
        traits: form.traits ? form.traits.split(',').map(s=>s.trim()) : [],
      });
      alert('Saved!');
      location.assign('/navatar');
    } catch (e: any) {
      alert(`Save failed: ${e.message ?? e}`);
    } finally { setBusy(false); }
  };

  const upd = (k: keyof typeof form) => (e: any) => setForm({ ...form, [k]: e.target.value });

  return (
    <main className="container">
      <h1 className="page">Character Card</h1>
      <form onSubmit={onSave} className="form">
        <input placeholder="Name" value={form.name} onChange={upd('name')} />
        <input placeholder="Species / Type" value={form.species} onChange={upd('species')} />
        <input placeholder="Kingdom" value={form.kingdom} onChange={upd('kingdom')} />
        <textarea placeholder="Backstory" value={form.backstory} onChange={upd('backstory')} />
        <input placeholder="Powers (comma separated)" value={form.powers} onChange={upd('powers')} />
        <input placeholder="Traits (comma separated)" value={form.traits} onChange={upd('traits')} />
        <div><a className="pill" href="/navatar">Back to My Navatar</a></div>
        <button className="btn" disabled={busy}>Save</button>
      </form>
    </main>
  );
}
