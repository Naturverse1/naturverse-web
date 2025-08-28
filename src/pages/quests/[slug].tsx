import React from "react";
import { useParams } from "react-router-dom";
import { getQuestBySlug, getQuestDone, setQuestDone } from "../../utils/quests-store";
import { SEED_QUESTS } from "../../data/quests";

export default function QuestDetail() {
  const { slug = "" } = useParams();
  const quest = getQuestBySlug(slug) || SEED_QUESTS.find(q => q.slug === slug);

  const [done, setDone] = React.useState<Record<string, boolean>>(() => getQuestDone(slug));
  const complete = quest ? quest.steps.every(s => done[s.id]) : false;

  if (!quest) return <main style={{maxWidth:800, margin:"24px auto", padding:"0 20px"}}><p>Quest not found.</p></main>;

  function toggle(id: string) {
    const next = { ...done, [id]: !done[id] };
    setDone(next);
    setQuestDone(slug, next);
  }

  async function share() {
    const url = new URL(location.pathname, location.origin).toString();
    try {
      const q = quest!;
      if (navigator.share) await navigator.share({ title: q.title, text: q.summary, url });
      else await navigator.clipboard.writeText(url);
    } catch {}
  }

  return (
    <main style={{ maxWidth: 800, margin:"24px auto", padding:"0 20px" }}>
      <h1>{quest.title}</h1>
      <p style={{ opacity:.8 }}>{quest.summary}</p>
      {quest.kingdom && <p style={{ opacity:.7 }}>Kingdom: {quest.kingdom}</p>}

      <ol style={{ display:"grid", gap:10, paddingLeft:20 }}>
        {quest.steps.map((s, i) => (
          <li key={s.id} style={{ border:"1px solid #e5e7eb", borderRadius:12, padding:12 }}>
            <label style={{ display:"grid", gap:6, cursor:"pointer" }}>
              <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                <input type="checkbox" checked={!!done[s.id]} onChange={()=>toggle(s.id)} />
                <b>Step {i+1}</b>
                {s.minutes ? <span style={{ opacity:.7 }}>(~{s.minutes} min)</span> : null}
              </div>
              <div>{s.text}</div>
              {s.tip && <div style={{ fontSize:13, opacity:.75 }}>Tip: {s.tip}</div>}
            </label>
          </li>
        ))}
      </ol>

      <div style={{ display:"flex", gap:10, marginTop:14 }}>
        <button className="btn" onClick={share}>Share</button>
        <a className="btn ghost" href="/quests">Back to quests</a>
        {complete && <span style={{ alignSelf:"center", fontWeight:700, color:"#22c55e" }}>✓ Completed</span>}
      </div>

      {!!quest.rewards?.length && (
        <div style={{ marginTop:18, border:"1px dashed #e5e7eb", borderRadius:12, padding:12 }}>
          <b>Rewards</b>
          <ul>
            {quest.rewards.map((r, idx) => (
              <li key={idx}>{r.type.toUpperCase()} — {r.code}{r.amount ? ` (+${r.amount})` : ""}</li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}
