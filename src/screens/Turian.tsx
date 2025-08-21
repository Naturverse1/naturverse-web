import React, { useState } from "react";

export default function Turian(){
  const [q,setQ]=useState(""); const [a,setA]=useState<string|null>(null); const [busy,setBusy]=useState(false);
  async function ask(){
    if(!q.trim()) return;
    setBusy(true); setA(null);
    try{
      const res = await fetch("/.netlify/functions/chat", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({ message: q })
      });
      const data = await res.json();
      setA(data.reply ?? "Turian is thinking...");
    } catch(e){
      setA("Sorry, I couldn't reach the guide right now.");
    } finally { setBusy(false); }
  }
  return (
    <section>
      <h1 className="h1">Turian 🦉</h1>
      <p className="p">Ask for tips, quests, and facts.</p>
      <div className="card">
        <div className="row">
          <input className="input" placeholder="Ask Turian anything…" value={q} onChange={e=>setQ(e.target.value)} />
          <button className="btn" onClick={ask} disabled={busy}>{busy?"Thinking…":"Ask"}</button>
        </div>
        {a && <p style={{marginTop:10}}>{a}</p>}
      </div>
    </section>
  );
}
