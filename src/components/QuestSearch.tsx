import { useEffect, useState } from "react";
import { track } from "@/lib/analytics";

export default function QuestSearch() {
  const [q, setQ] = useState("");
  const [res, setRes] = useState<any[]>([]);
  useEffect(() => {
    const t = setTimeout(async () => {
      if (!q.trim()) { setRes([]); return; }
      const r = await fetch(`/.netlify/functions/search-quests?q=${encodeURIComponent(q)}`);
      const data = await r.json();
      setRes(data);
      track('quest_search', { q, results: data.length });
    }, 180);
    return () => clearTimeout(t);
  }, [q]);

  return (
    <div className="quest-search">
      <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search mini-quests…" />
      {!!res.length && (
        <ul className="qs-list">
          {res.map((x:any) => (
            <li key={x.id}><a href={`/quests/${x.id}`}><strong>{x.title}</strong><span>{x.summary}</span></a></li>
          ))}
        </ul>
      )}
      <style>{`
        .quest-search{position:relative;max-width:520px}
        .qs-list{position:absolute;z-index:50;background:#fff;border:1px solid #e5e7eb;border-radius:10px;width:100%;margin-top:6px;padding:6px;display:grid;gap:6px}
        .qs-list a{display:flex;flex-direction:column;gap:2px;padding:6px;border-radius:8px}
        .qs-list a:hover{background:#f8fafc}
        .qs-list span{font-size:.85rem;opacity:.75}
      `}</style>
    </div>
  );
}
