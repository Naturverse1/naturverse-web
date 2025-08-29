import { useEffect, useState } from "react";

export default function AdminLogs() {
  const [rows, setRows] = useState<any[]>([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string>("");

  async function load() {
    setBusy(true); setErr("");
    try {
      const res = await fetch("/.netlify/functions/log?limit=500", {
        headers: { authorization: `Bearer ${import.meta.env.VITE_ADMIN_PUBLIC_TOKEN || ''}` }
      });
      if (!res.ok) throw new Error(await res.text());
      setRows(await res.json());
    } catch (e:any) { setErr(e.message); }
    setBusy(false);
  }

  useEffect(()=>{ load(); }, []);

  return (
    <main className="container">
      <h1>App Logs</h1>
      <button onClick={load} disabled={busy}>Refresh</button>
      {err && <p style={{color:'crimson'}}>{err}</p>}
      <div style={{marginTop:12, display:'grid', gap:8}}>
        {rows.map(r => (
          <div key={r.id} style={{
            border:'1px solid #e5e7eb', borderLeft:`4px solid ${r.level==='error'?'#ef4444':r.level==='warn'?'#f59e0b':'#3b82f6'}`,
            borderRadius:8, padding:8
          }}>
            <div style={{display:'flex', gap:8, justifyContent:'space-between'}}>
              <strong>{r.level.toUpperCase()}</strong>
              <span style={{opacity:.7}}>{new Date(r.created_at).toLocaleString()}</span>
            </div>
            <div>{r.message}</div>
            {r.meta && <pre style={{background:'#f8fafc',padding:8,borderRadius:6,overflow:'auto'}}>{JSON.stringify(r.meta,null,2)}</pre>}
          </div>
        ))}
      </div>
    </main>
  );
}
