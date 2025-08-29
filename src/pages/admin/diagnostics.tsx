import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Diagnostics() {
  const [health, setHealth] = useState<any>(null);
  const [progress, setProgress] = useState<any>(null);
  const [err, setErr] = useState<string>("");

  async function pingHealth() {
    setErr(""); setHealth(null);
    const r = await fetch("/.netlify/functions/health");
    if (!r.ok) return setErr(await r.text());
    setHealth(await r.json());
  }
  async function fetchMe() {
    setErr(""); setProgress(null);
    if (!supabase) { setErr("Not signed in"); return; }
    const { data } = await supabase.auth.getSession();
    const t = data.session?.access_token;
    if (!t) { setErr("Not signed in"); return; }
    const r = await fetch("/.netlify/functions/progress-get", { headers: { "x-supabase-token": t } });
    if (!r.ok) return setErr(await r.text());
    setProgress(await r.json());
  }

  return (
    <main className="container" style={{ padding: 24 }}>
      <h1>Diagnostics</h1>
      <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
        <button onClick={pingHealth}>Ping health</button>
        <button onClick={fetchMe}>Fetch my progress</button>
      </div>
      {err && <p style={{ color:"crimson" }}>{err}</p>}
      {health && <pre style={{ marginTop:10, background:"#f8fafc", padding:10 }}>{JSON.stringify(health,null,2)}</pre>}
      {progress && <pre style={{ marginTop:10, background:"#f8fafc", padding:10 }}>{JSON.stringify(progress,null,2)}</pre>}
      <div style={{ marginTop:16 }}>
        <h3>Client env (VITE_*)</h3>
        <ul>
          <li>VITE_STRIPE_PK: {import.meta.env.VITE_STRIPE_PK ? "set" : "missing"}</li>
          <li>VITE_ADMIN_PUBLIC_TOKEN: {import.meta.env.VITE_ADMIN_PUBLIC_TOKEN ? "set" : "missing"}</li>
          <li>VITE_KILLSWITCH: {import.meta.env.VITE_KILLSWITCH ?? "unset"}</li>
        </ul>
      </div>
    </main>
  );
}
