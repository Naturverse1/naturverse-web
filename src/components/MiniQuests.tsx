import * as React from 'react';
import { useSupabase } from '../lib/useSupabase';

const localFallback = [
  { id: 'tuk-tuk', title: 'Tuk-Tuk Dash', xp: 25 },
  { id: 'spice-run', title: 'Spice Market', xp: 25 },
  { id: 'temple', title: 'Temple Trivia', xp: 25 },
];

export default function MiniQuests() {
  const supabase = useSupabase();
  const [quests, setQuests] = React.useState(localFallback);

  React.useEffect(() => {
    if (!supabase) return;
    (async () => {
      try {
        const { data } = await supabase
          .from('mini_quests')
          .select('*')
          .eq('world', 'thailandia')
          .limit(12);
        if (data && data.length) setQuests(data as any);
      } catch {
        // ignore; fallback already shown
      }
    })();
  }, [supabase]);

  return (
    <section aria-label="Mini quests">
      <h3 style={{ marginBottom: '0.5rem' }}>Mini-Quests in Thailandia</h3>
      <ul
        style={{
          display: 'grid',
          gap: '8px',
          gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))',
        }}
      >
        {quests.map((q) => (
          <li
            key={q.id}
            style={{
              padding: '12px',
              border: '1px dashed #c9d4ff',
              borderRadius: 12,
            }}
          >
            <div style={{ fontWeight: 600 }}>{q.title}</div>
            <div style={{ opacity: 0.7, fontSize: 12 }}>{q.xp} XP</div>
          </li>
        ))}
      </ul>
    </section>
  );
}

