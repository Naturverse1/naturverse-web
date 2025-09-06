import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getActiveNavatar, getCard, upsertCard } from '../../lib/navatar';
import { useSession } from '../../lib/session';
import { NavatarPills } from '../../components/NavatarPills';

export default function CardPage() {
  const { user } = useSession();
  const nav = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [species, setSpecies] = useState('');
  const [kingdom, setKingdom] = useState('');
  const [backstory, setBackstory] = useState('');
  const [powers, setPowers] = useState(''); // comma
  const [traits, setTraits] = useState(''); // comma
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      if (!user) return;
      setLoading(true);
      const active = await getActiveNavatar(user.id);
      if (active?.id) {
        setActiveId(active.id);
        const card = await getCard(user.id, active.id);
        if (card) {
          setName(card.name ?? '');
          setSpecies(card.species ?? '');
          setKingdom(card.kingdom ?? '');
          setBackstory(card.backstory ?? '');
          setPowers((card.powers ?? []).join(', '));
          setTraits((card.traits ?? []).join(', '));
        }
      }
      setLoading(false);
    })();
  }, [user?.id]);

  const disabled = useMemo(() => saving || !user || !activeId, [saving, user, activeId]);

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !activeId) return;
    setSaving(true);
    try {
      await upsertCard({
        user_id: user.id,
        navatar_id: activeId,
        name: name.trim(),
        species: species.trim(),
        kingdom: kingdom.trim(),
        backstory: backstory.trim(),
        powers: powers.split(',').map(s => s.trim()).filter(Boolean),
        traits: traits.split(',').map(s => s.trim()).filter(Boolean),
      });
      nav('/navatar', { replace: true, state: { toast: 'Card saved ✓' } });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="container max-w-3xl mx-auto px-4 pb-24">
      <nav className="text-sm mb-4"><Link to="/">Home</Link> / <Link to="/navatar">Navatar</Link> / Card</nav>
      <h1 className="text-4xl font-extrabold text-[color:var(--nv-blue-900)]">Character Card</h1>
      <div className="mt-4 md:block hidden">
        <NavatarPills active="card" color="blue" />
      </div>

      {!loading && !activeId && (
        <div className="mt-6 rounded-2xl bg-[color:var(--nv-blue-200)]/40 border border-[color:var(--nv-blue-200)] p-5 text-[color:var(--nv-blue-900)]">
          <div className="font-semibold mb-1">No Navatar selected</div>
          <div className="mb-3">Pick or upload a Navatar first, then return to create its card.</div>
          <Link className="nv-btn" to="/navatar/pick">Pick a Navatar</Link>
        </div>
      )}

      <form onSubmit={onSave} className="mt-6 space-y-4 text-[color:var(--nv-blue-900)]">
        <Field label="Name" value={name} onChange={setName} />
        <Field label="Species / Type" value={species} onChange={setSpecies} />
        <Field label="Kingdom" value={kingdom} onChange={setKingdom} />
        <Area label="Backstory" value={backstory} onChange={setBackstory} rows={5} />
        <Field label="Powers (comma separated)" value={powers} onChange={setPowers} />
        <Field label="Traits (comma separated)" value={traits} onChange={setTraits} />

        <div className="sticky bottom-0 left-0 right-0 py-3 bg-white/85 backdrop-blur border-t border-[color:var(--nv-blue-200)] -mx-4 px-4">
          <div className="flex gap-3 justify-end">
            <Link to="/navatar" className="nv-btn-outline">Back to My Navatar</Link>
            <button disabled={disabled} type="submit" className="nv-btn">{saving ? 'Saving…' : 'Save'}</button>
          </div>
        </div>
      </form>
    </div>
  );
}

function Field(props: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <div className="mb-1 font-semibold">{props.label}</div>
      <input className="nv-input w-full" value={props.value} onChange={e => props.onChange(e.target.value)} />
    </label>
  );
}

function Area(props: { label: string; value: string; onChange: (v: string) => void; rows?: number }) {
  return (
    <label className="block">
      <div className="mb-1 font-semibold">{props.label}</div>
      <textarea
        rows={props.rows ?? 4}
        className="nv-input w-full"
        value={props.value}
        onChange={e => props.onChange(e.target.value)}
      />
    </label>
  );
}

