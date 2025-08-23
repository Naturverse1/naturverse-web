import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

type Stamp = {
  id: string;
  world: string;
  earned_at: string | null;
};

const WORLDS = [
  'Thailandia',
  'Chilandia',
  'Japonica',
  'Indilandia',
  'Brazilandia',
  'Africonia',
  'Europalia',
  'Britannula',
  'Amerilandia',
  'Australandia',
  'Kiwlandia',
  'Madagascaria',
  'Greenlandia',
  'Antarcticland',
];

export default function PassportPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [stamps, setStamps] = useState<Stamp[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: sess } = await supabase.auth.getSession();
      const session = sess.session;
      if (!session) {
        setLoading(false);
        return;
      }
      const uid = session.user.id;
      setUserId(uid);

      const { data, error } = await supabase
        .from('passport_stamps')
        .select('id, world, earned_at')
        .eq('user_id', uid)
        .order('earned_at', { ascending: false });

      if (!error && data) setStamps(data as Stamp[]);
      setLoading(false);
    })();
  }, []);

  async function addDemoStamp(world: string) {
    if (!userId) return;
    const { error } = await supabase
      .from('passport_stamps')
      .insert({ user_id: userId, world, earned_at: new Date().toISOString() });
    if (error) return alert(error.message);
    location.reload();
  }

  if (loading) return <main><h1>Passport</h1><p>Loading…</p></main>;
  if (!userId) return <main><h1>Passport</h1><p>Please sign in.</p></main>;

  const earned = new Set(stamps.map((s) => s.world));

  return (
    <main className="passport">
      <h1>Passport</h1>
      <p className="muted">Collect stamps by completing kingdoms.</p>

      <div className="stamp-grid">
        {WORLDS.map((w) => {
          const has = earned.has(w);
          return (
            <div key={w} className={`stamp ${has ? 'earned' : 'locked'}`}>
              <div className="stamp-title">{w}</div>
              <div className="stamp-mark">{has ? '✅' : '—'}</div>
              {!has && (
                <button
                  className="btn tiny outline"
                  onClick={() => addDemoStamp(w)}
                >
                  Add demo stamp
                </button>
              )}
            </div>
          );
        })}
      </div>

      <section className="stamp-list">
        <h2>Recent stamps</h2>
        {stamps.length === 0 ? (
          <p>No stamps yet.</p>
        ) : (
          <ul>
            {stamps.map((s) => (
              <li key={s.id}>
                {s.world} —{' '}
                {s.earned_at ? new Date(s.earned_at).toLocaleString() : ''}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

