import { useState } from "react";

export default function Turian() {
  const [q,setQ] = useState(""); const [a,setA] = useState<string|null>(null); const [busy,setBusy]=useState(false);
  const ask = async () => {
    if(!q.trim()) return;
    setBusy(true); setA(null);
    try {
      const res = await fetch("/.netlify/functions/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({q})});
      const data = await res.json();
      setA(data?.text ?? "…");
    } catch { setA("Sorry, something went wrong."); }
    setBusy(false);
  };
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold">Turian 🦉</h2>
      <p className="text-gray-600">Ask for tips, quests, and facts.</p>
      <div className="flex gap-2">
        <input className="flex-1 rounded border px-3 py-2" placeholder="Ask Turian anything…" value={q} onChange={e=>setQ(e.target.value)} />
        <button onClick={ask} disabled={busy} className="rounded border px-4 py-2">{busy?"Asking…":"Ask"}</button>
      </div>
      {a && <div className="rounded border p-3 bg-gray-50">{a}</div>}
    </section>
  );
}
