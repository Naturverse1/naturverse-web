import { useEffect, useState } from 'react';
import Breadcrumbs from '../../components/navatar/Breadcrumbs';
import NavTabs from '../../components/navatar/NavTabs';
import { useNavatar, CardData } from '../../lib/navatar-context';

const empty: CardData = { name:'', species:'', kingdom:'', backstory:'', powers:[], traits:[] };

export default function Card() {
  const { active, card, saveCard, refresh } = useNavatar();
  const [form, setForm] = useState<CardData>(empty);

  useEffect(() => { if (card) setForm(card); }, [card]);

  const update = (k: keyof CardData, v: string) => {
    if (k === 'powers' || k === 'traits') {
      setForm(f => ({ ...f, [k]: v.split(',').map(s => s.trim()).filter(Boolean) }));
    } else {
      setForm(f => ({ ...f, [k]: v }));
    }
  };

  const onSave = async () => {
    try {
      await saveCard(form);
      alert('Saved!');
      await refresh();
    } catch (e: any) {
      alert(e.message ?? 'Failed to save');
    }
  };

  return (
    <div className="max-w-screen-md mx-auto px-4">
      <Breadcrumbs trail={[{ to: '/navatar', label: 'Navatar' }, { label: 'Card' }]} />
      <h1 className="text-4xl font-bold text-blue-700 mb-2">Character Card</h1>
      <NavTabs />
      {!active ? (
        <div className="mt-4 text-blue-800">Please pick or upload a Navatar first.</div>
      ) : (
        <div className="rounded-2xl border bg-white p-4 shadow">
          <div className="grid gap-3">
            <label className="text-sm">Name
              <input className="block w-full border rounded px-3 py-2"
                value={form.name ?? ''} onChange={e => update('name', e.target.value)} />
            </label>

            <label className="text-sm">Species / Type
              <input className="block w-full border rounded px-3 py-2"
                value={form.species ?? ''} onChange={e => update('species', e.target.value)} />
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="text-sm">Kingdom
                <input className="block w-full border rounded px-3 py-2"
                  value={form.kingdom ?? ''} onChange={e => update('kingdom', e.target.value)} />
              </label>
              <label className="text-sm">Backstory
                <textarea className="block w-full border rounded px-3 py-2"
                  rows={3}
                  value={form.backstory ?? ''} onChange={e => update('backstory', e.target.value)} />
              </label>
            </div>

            <label className="text-sm">Powers (comma separated)
              <input className="block w-full border rounded px-3 py-2"
                value={(form.powers ?? []).join(', ')} onChange={e => update('powers', e.target.value)} />
            </label>

            <label className="text-sm">Traits (comma separated)
              <input className="block w-full border rounded px-3 py-2"
                value={(form.traits ?? []).join(', ')} onChange={e => update('traits', e.target.value)} />
            </label>

            <button onClick={onSave} className="mt-2 justify-self-start px-5 py-2 rounded-full bg-blue-600 text-white">
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

