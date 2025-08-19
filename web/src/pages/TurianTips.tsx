import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

type Tip = { id: number; title: string | null; body: string | null; created_at?: string };

export default function TurianTips() {
  const [tips, setTips] = useState<Tip[]>([]);
  useEffect(() => {
    supabase.from("tips").select("*").order("id", { ascending: false }).then(({ data }) => setTips(data ?? []));
  }, []);

  return (
    <section>
      <h2>🌱 Turian Tips</h2>
      {tips.length === 0 ? <p>No tips yet.</p> : tips.map(t => (
        <article key={t.id} style={{ margin: "1rem 0" }}>
          <h4>{t.title || "Turian Tip"}</h4>
          <p>{t.body}</p>
        </article>
      ))}
      <form method="post" action="/.netlify/functions/generate" style={{ marginTop: 16 }}>
        <input type="hidden" name="type" value="tip" />
        <button>➕ Generate Tip with AI</button>
      </form>
    </section>
  );
}
