import { useEffect, useState } from "react";
import type { Score } from "../types";
import { api } from "../lib/api";

export default function Leaderboard({ game = "game1" }: { game?: string }) {
  const [scores, setScores] = useState<Score[]>([]);
  const [name, setName] = useState("");
  const [points, setPoints] = useState<number>(0);

  async function load() {
    const data = await api<Score[]>(`/.netlify/functions/scores?game=${encodeURIComponent(game)}`);
    setScores(data);
  }
  useEffect(()=>{ load(); }, [game]);

  async function submit() {
    await api(`/.netlify/functions/scores?game=${encodeURIComponent(game)}`, {
      method: "POST",
      body: JSON.stringify({ name: name || "Player", points }),
    });
    setPoints(0);
    load();
  }

  return (
    <div>
      <h3>Leaderboard</h3>
      <ol>{scores.map(s => <li key={s.id}>{s.name} — {s.points}</li>)}</ol>
      <div style={{ display: "flex", gap: 8 }}>
        <input placeholder="Name" value={name} onChange={(e)=>setName(e.target.value)} />
        <input type="number" placeholder="Points" value={points} onChange={(e)=>setPoints(parseInt(e.target.value||"0"))} />
        <button onClick={submit}>Submit</button>
      </div>
    </div>
  );
}

