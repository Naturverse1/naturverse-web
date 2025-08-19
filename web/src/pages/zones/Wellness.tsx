import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

type WTip = { id:number; text:string };

export default function Wellness() {
  const [tips, setTips] = useState<WTip[]>([]);
  useEffect(() => {
    supabase.from("wellness_tips").select("*").order("id", { ascending: true }).then(({ data }) => setTips(data ?? []));
  }, []);

  return (
    <section>
      <h2>🧘 Wellness</h2>
      {tips.length === 0 ? <p>Add rows to <code>wellness_tips</code> in Supabase.</p> :
        <ol>{tips.map(t => <li key={t.id}>{t.text}</li>)}</ol>}
    </section>
  );
}
