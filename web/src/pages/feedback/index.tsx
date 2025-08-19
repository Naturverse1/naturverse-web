import React, { useEffect, useState } from "react";

type Entry = { id: string; name: string; message: string; createdAt: number };

export default function Feedback() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [entries, setEntries] = useState<Entry[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("nv_feedback");
      if (raw) setEntries(JSON.parse(raw));
    } catch {}
  }, []);

  function save(list: Entry[]) {
    setEntries(list);
    try { localStorage.setItem("nv_feedback", JSON.stringify(list)); } catch {}
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;
    const next: Entry = {
      id: Math.random().toString(36).slice(2),
      name: name.trim() || "Anonymous",
      message: message.trim(),
      createdAt: Date.now(),
    };
    save([next, ...entries]);
    setMessage("");
  }

  function clearAll() {
    save([]);
  }

  return (
    <section>
      <h1>💌 Feedback</h1>
      <p>Tell us what to improve. Stored locally for now; we’ll wire Supabase later.</p>

      <form onSubmit={submit} style={{ display:"grid", gap:8, marginTop:12, maxWidth:560 }}>
        <input placeholder="Your name (optional)" value={name} onChange={e=>setName(e.target.value)} />
        <textarea placeholder="Your feedback..." value={message} onChange={e=>setMessage(e.target.value)} rows={4} />
        <div>
          <button type="submit">Send</button>
          <button type="button" onClick={clearAll} style={{ marginLeft:8 }}>Clear local</button>
        </div>
      </form>

      {entries.length > 0 && (
        <>
          <h3 style={{ marginTop:20 }}>Recent</h3>
          <ul style={{ padding:0, listStyle:"none", display:"grid", gap:10 }}>
            {entries.map(e=>(
              <li key={e.id} style={{ border:"1px solid #eee", borderRadius:8, padding:12 }}>
                <div style={{ fontWeight:600 }}>{e.name}</div>
                <div style={{ whiteSpace:"pre-wrap" }}>{e.message}</div>
                <small style={{ opacity:.7 }}>{new Date(e.createdAt).toLocaleString()}</small>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}

