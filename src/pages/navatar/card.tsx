import { useEffect, useState } from 'react';
import { supabase } from '@/supabaseClient';
import { useSession } from '@/state/session';
import { NavPills } from './_shared/NavPills';

type Card = {
  id?: string;
  name?: string;
  species?: string;
  kingdom?: string;
  backstory?: string;
  powers?: string[] | null;
  traits?: string[] | null;
};

export default function CharacterCard() {
  const { user } = useSession();
  const [card, setCard] = useState<Card>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      if (!user) return;
      // fetch latest card for this user
      const { data } = await supabase
        .from('character_cards')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (data) setCard(data as Card);
    })();
  }, [user]);

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return alert('Please sign in.');

    setSaving(true);
    const payload = {
      ...card,
      user_id: user.id,
      // link to current primary avatar
      avatar_id: await getPrimaryAvatarId(user.id),
    };

    const { data, error } = await supabase
      .from('character_cards')
      .upsert(payload, { onConflict: 'user_id,avatar_id' })
      .select()
      .single();

    setSaving(false);
    if (error) return alert(`Save failed: ${error.message}`);
    setCard(data);
    alert('Saved!');
    // reflect on main pages immediately
    window.location.href = '/navatar';
  }

  return (
    <main className="container">
      <ol className="breadcrumb">
        <li>
          <a href="/">Home</a>
        </li>
        <li>/ Navatar</li>
        <li>/ Card</li>
      </ol>
      <h1>Character Card</h1>
      <NavPills active="Card" />
      <form className="cardForm" onSubmit={onSave}>
        <input
          value={card.name ?? ''}
          onChange={(e) => setCard((c) => ({ ...c, name: e.target.value }))}
          placeholder="Name"
        />
        <input
          value={card.species ?? ''}
          onChange={(e) => setCard((c) => ({ ...c, species: e.target.value }))}
          placeholder="Species / Type"
        />
        <div className="row2">
          <input
            value={card.kingdom ?? ''}
            onChange={(e) => setCard((c) => ({ ...c, kingdom: e.target.value }))}
            placeholder="Kingdom"
          />
          <textarea
            value={card.backstory ?? ''}
            onChange={(e) => setCard((c) => ({ ...c, backstory: e.target.value }))}
            placeholder="Backstory"
          />
        </div>
        <input
          value={(card.powers ?? []).join(', ')}
          onChange={(e) => setCard((c) => ({ ...c, powers: splitCsv(e.target.value) }))}
          placeholder="Powers (comma separated)"
        />
        <input
          value={(card.traits ?? []).join(', ')}
          onChange={(e) => setCard((c) => ({ ...c, traits: splitCsv(e.target.value) }))}
          placeholder="Traits (comma separated)"
        />
        <button className="btn" disabled={saving}>
          {saving ? 'Saving…' : 'Save'}
        </button>
      </form>
    </main>
  );
}

function splitCsv(s: string) {
  return s
    .split(',')
    .map((x) => x.trim())
    .filter(Boolean);
}

async function getPrimaryAvatarId(user_id: string): Promise<string | null> {
  const { data } = await supabase
    .from('avatars')
    .select('id')
    .eq('user_id', user_id)
    .eq('is_primary', true)
    .maybeSingle();
  return data?.id ?? null;
}
