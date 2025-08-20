import { useState } from "react";
import { api } from "../../lib/api";

export default function NaturTutor(){
  const [q, setQ] = useState("");
  const [a, setA] = useState<string | null>(null);
  const ask = async () => {
    setA("…");
    try {
      const res = await api("ai-chat", { prompt: q });
      setA(res.content);
    } catch (e:any) { setA("Tutor is resting right now."); }
  };
  return (
    <>
      <h3>Naturversity Tutor</h3>
      <div className="grid2">
        <input placeholder="Ask a nature question…" value={q} onChange={e=>setQ(e.target.value)} />
        <button onClick={ask}>Ask</button>
      </div>
      {a && <p style={{marginTop:12}}>{a}</p>}
    </>
  );
}
