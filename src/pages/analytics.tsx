import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

type Row = {
  id: string;
  event: string;
  from_page: string | null;
  to_page: string | null;
  text: string | null;
  created_at: string;
};

export default function AnalyticsPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('analytics')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(200);
      if (!error && data) setRows(data as Row[]);
      setLoading(false);
    })();
  }, []);

  if (loading) return <div style={{ padding: 24 }}>Loading…</div>;

  return (
    <div style={{ padding: 24 }}>
      <h1>Turian Analytics (latest 200)</h1>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th align="left">Time</th>
            <th align="left">Event</th>
            <th align="left">From</th>
            <th align="left">To</th>
            <th align="left">Text</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} style={{ borderTop: '1px solid #eee' }}>
              <td>{new Date(r.created_at).toLocaleString()}</td>
              <td>{r.event}</td>
              <td>{r.from_page ?? ''}</td>
              <td>{r.to_page ?? ''}</td>
              <td>{r.text ?? ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

