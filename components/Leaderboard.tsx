import * as React from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseAnon = import.meta.env.VITE_SUPABASE_ANON_KEY!;
const sb = (supabaseUrl && supabaseAnon) ? createClient(supabaseUrl, supabaseAnon) : null;

type Row = { value: number; created_at: string };

export function Leaderboard({ game }: { game: string }) {
  const [top, setTop] = React.useState<Row[]>([]);
  const [mine, setMine] = React.useState<number | null>(null);

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      if (!sb) return; // hide in demo mode
      const topq = await sb.from('scores')
        .select('value,created_at')
        .eq('game', game)
        .order('value', { ascending: false })
        .limit(10);
      if (mounted && !topq.error) setTop(topq.data as Row[]);

      const u = await sb.auth.getUser();
      const uid = u.data.user?.id;
      if (uid) {
        const myq = await sb.from('scores')
          .select('value').eq('game', game).eq('user_id', uid)
          .order('value', { ascending: false }).limit(1);
        if (!myq.error && myq.data?.length) setMine(myq.data[0].value as number);
      }
    })();
    return ()=>{mounted=false};
  }, [game]);

  if (!sb) return null;

  return (
    <div className="card" style={{ marginTop: 16 }}>
      <h3 style={{ color: 'var(--naturverse-blue)' }}>Leaderboard</h3>
      <ol>
        {top.map((r, i) => (
          <li key={i} style={{ color: 'var(--naturverse-blue)' }}>
            {r.value}
          </li>
        ))}
      </ol>
      {mine != null && (
        <div style={{ marginTop: 8, fontWeight: 600, color: 'var(--naturverse-blue)' }}>
          Your best: {mine}
        </div>
      )}
    </div>
  );
}
