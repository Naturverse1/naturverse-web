import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { generateTip } from "../lib/openai";

type Tip = { id: string; text: string; created_at: string };

export default function TurianTips() {
  const [tips, setTips] = useState<Tip[]>([]);
  const [busy, setBusy] = useState(false);

  async function load() {
    const { data, error } = await supabase.from("tips").select("id,text,created_at").order("created_at",{ascending:false});
    if (!error && data) setTips(data as any);
  }

  useEffect(() => { load(); }, []);

  async function onGenerate() {
    setBusy(true);
    try {
      const text = await generateTip("Give a single, practical eco or wellness micro-tip (max 1–2 sentences).");
      const { data, error } = await supabase.from("tips").insert({ text }).select().single();
      if (!error && data) setTips(prev => [data as any, ...prev]);
    } finally { setBusy(false); }
  }

  return (
    <section>
      <h2>🌱 Turian Tips</h2>
      {!tips.length && <p>No tips yet.</p>}
      <button onClick={onGenerate} disabled={busy}>{busy ? "Generating…" : "＋ Generate Tip with AI"}</button>
      <ul>
        {tips.map(t => (<li key={t.id} style={{margin:"0.75rem 0"}}>{t.text}</li>))}
      </ul>
    </section>
  );
}
