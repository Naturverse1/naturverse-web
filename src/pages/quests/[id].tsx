import { useEffect, useState } from "react";
import { metaTag } from "@/lib/seo";
import { track } from "@/lib/analytics";

type Quest = { id:string; title:string; summary?:string; tags?:string[]; body?:string };

export default function QuestDetail() {
  const [q, setQ] = useState<Quest | null>(null);
  const id = typeof window !== "undefined" ? window.location.pathname.split("/").pop()! : "";

  useEffect(() => {
    (async () => {
      // Try local first (fast), then index fallback
      try {
        const { default: items } = await import("@/data/quests.json");
        const found = (items as Quest[]).find(x => x.id === id);
        if (found) { setQ(found); return; }
      } catch {}
      const r = await fetch(`/.netlify/functions/search-quests?q=${encodeURIComponent(id)}`);
      const arr = await r.json(); setQ(arr?.find((x:any)=>x.id===id) || null);
    })();
  }, [id]);

  useEffect(() => {
    if (q) track("quest_view", { id: q.id });
  }, [q]);

  if (!q) return <main className="container" style={{padding:24}}><p>Loading…</p></main>;

  return (
    <>
      {metaTag({ title: q.title, desc: q.summary })}
      <main className="container" style={{ padding: 24, maxWidth: 720 }}>
        <a href="/quests" className="link">← All quests</a>
        <h1 style={{ marginTop: 10 }}>{q.title}</h1>
        {!!(q.tags||[]).length && (
          <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom: 8 }}>
            {q.tags!.map(t => <span className="pill" key={t}>{t}</span>)}
          </div>
        )}
        {q.summary && <p className="muted">{q.summary}</p>}

        <article className="quest-body">
          {q.body?.split("\n").map((ln, i) => <p key={i}>{ln}</p>)}
        </article>

        <div className="actions" style={{ display:"flex", gap:8, marginTop: 12 }}>
          <button onClick={() => track("quest_start", { id: q.id })}>Start</button>
          <button onClick={() => { track("quest_complete", { id: q.id }); alert("Nice work 🌿"); }}>Complete</button>
          <button onClick={() => navigator.share?.({ title:q.title, url: location.href }) ?? copy(location.href)}>
            Share
          </button>
        </div>
      </main>
    </>
  );
}

function copy(t:string){ navigator.clipboard.writeText(t); }
