import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Breadcrumbs from '../../components/Breadcrumbs';
import NavatarTabs from '../../components/NavatarTabs';
import { useAuthUser } from '../../lib/useAuthUser';
import { getActiveNavatar, updateActiveNavatarCard, CharacterCard } from '../../lib/navatar';
import '../../styles/navatar.css';

const labelCls = 'text-blue-600 font-semibold';
const inputCls =
  'w-full rounded-lg border border-blue-200 bg-white/70 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-blue-700 placeholder-blue-300';

export default function NavatarCardPage() {
  const nav = useNavigate();
  const { user } = useAuthUser();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [form, setForm] = useState<any>({});

  useEffect(() => {
    let ignore = false;
    (async () => {
      if (!user) { setLoading(false); return; }
      const { data, error } = await getActiveNavatar(user.id);
      if (ignore) return;
      if (error) {
        console.error(error);
      } else if (data) {
        setActiveId(data.id);
        const card = (data.card ?? {}) as CharacterCard;
        setForm({
          name: card.name ?? '',
          species: card.species ?? '',
          kingdom: card.kingdom ?? '',
          backstory: card.backstory ?? '',
          powers: card.powers ?? [],
          traits: card.traits ?? [],
        });
      }
      setLoading(false);
    })();
    return () => { ignore = true; };
  }, [user]);

  const canSave = useMemo(() => !!activeId && !saving, [activeId, saving]);

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    if (!activeId || !user) {
      alert('Please create or select a Navatar first.');
      return;
    }
    setSaving(true);
    const card: CharacterCard = {
      name: form.name?.trim(),
      species: form.species?.trim(),
      kingdom: form.kingdom?.trim(),
      backstory: form.backstory?.trim(),
      powers: (Array.isArray(form.powers) ? form.powers : (form.powers ?? '').split(',')).map((s: string) => s.trim()).filter(Boolean),
      traits: (Array.isArray(form.traits) ? form.traits : (form.traits ?? '').split(',')).map((s: string) => s.trim()).filter(Boolean),
    };
    const { error } = await updateActiveNavatarCard(user.id, card);
    setSaving(false);
    if (error) {
      console.error(error);
      alert(error.message);
    } else {
      nav('/navatar#card', { replace: true });
    }
  }

  return (
    <main className="container">
      <Breadcrumbs items={[{ href: '/', label: 'Home' }, { href: '/navatar', label: 'Navatar' }, { label: 'Card' }]} />
      <h1 className="center">Character Card</h1>
      <div className="hidden md:block"><NavatarTabs /></div>
      {loading ? (
        <p className="text-blue-500">Loading…</p>
      ) : (
        <form onSubmit={onSave} style={{ maxWidth: 720, margin: '16px auto', display: 'grid', gap: 12 }}>
          {!activeId && (
            <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-blue-700">
              You don’t have an active Navatar.{' '}
              <Link className="underline font-semibold" to="/navatar/pick">Pick</Link> or{' '}
              <Link className="underline font-semibold" to="/navatar/upload">Upload</Link> one to save your card.
            </div>
          )}

          <label className={labelCls}>
            Name
              <input className={inputCls} value={form.name ?? ''} onChange={e => setForm((f: any) => ({ ...f, name: e.target.value }))} />
          </label>

          <label className={labelCls}>
            Species / Type
              <input className={inputCls} value={form.species ?? ''} onChange={e => setForm((f: any) => ({ ...f, species: e.target.value }))} />
          </label>

          <label className={labelCls}>
            Kingdom
              <input className={inputCls} value={form.kingdom ?? ''} onChange={e => setForm((f: any) => ({ ...f, kingdom: e.target.value }))} />
          </label>

          <label className={labelCls}>
            Backstory
              <textarea rows={5} className={inputCls} value={form.backstory ?? ''} onChange={e => setForm((f: any) => ({ ...f, backstory: e.target.value }))} />
          </label>

          <label className={labelCls}>
            Powers (comma separated)
            <input className={inputCls}
              value={Array.isArray(form.powers) ? form.powers.join(', ') : (form.powers ?? '')}
              onChange={e => setForm((f: any) => ({ ...f, powers: e.target.value }))} />
          </label>

          <label className={labelCls}>
            Traits (comma separated)
            <input className={inputCls}
              value={Array.isArray(form.traits) ? form.traits.join(', ') : (form.traits ?? '')}
              onChange={e => setForm((f: any) => ({ ...f, traits: e.target.value }))} />
          </label>

          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <Link to="/navatar" className="pill">Back to My Navatar</Link>
            <button disabled={!canSave} className="pill pill--active" type="submit">
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      )}
    </main>
  );
}
