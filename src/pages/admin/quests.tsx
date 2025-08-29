import { useState } from "react";

export default function AdminQuests() {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  async function reindex() {
    setBusy(true); setMsg("");
    try {
      const { default: items } = await import("@/data/quests.json");
      const res = await fetch("/.netlify/functions/reindex-quests", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "authorization": `Bearer ${import.meta.env.VITE_ADMIN_PUBLIC_TOKEN || ""}`
        },
        body: JSON.stringify({ items })
      });
      if (!res.ok) throw new Error(await res.text());
      setMsg("Reindexed ✅");
    } catch (e:any) {
      setMsg(`Failed: ${e.message}`);
    } finally { setBusy(false); }
  }

  return (
    <main className="container" style={{ padding: 24 }}>
      <h1>Admin · Quests</h1>
      <p>Push local <code>quests.json</code> into Supabase full-text index.</p>
      <button onClick={reindex} disabled={busy}>{busy ? "Reindexing…" : "Reindex now"}</button>
      {msg && <p style={{ marginTop: 8 }}>{msg}</p>}
    </main>
  );
}
