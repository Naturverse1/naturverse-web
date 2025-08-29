import { useEffect, useMemo, useState } from "react";
import { track } from "@/lib/analytics";

const TAGS = ["starter","breathwork","focus","sleep","grounding","energy","movement","calm","anxiety","sunlight","evening","routine","productivity"];

export type QuestHit = { id: string; title: string; summary: string | null; tags: string[] | null };

export default function QuestSearchBar() {
  const [q, setQ] = useState("");
  const [sel, setSel] = useState<string[]>([]);
  const [hits, setHits] = useState<QuestHit[]>([]);
  const [page, setPage] = useState(0);
  const pageSize = 6;

  const debounced = useDebounce(q, 200);
  const filtered = useMemo(() => {
    const t = sel.map(s => s.toLowerCase());
    return hits.filter(h => !t.length || (h.tags||[]).some(tag => t.includes(tag.toLowerCase())));
  }, [hits, sel]);

  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const slice = filtered.slice(page*pageSize, (page+1)*pageSize);

  useEffect(() => {
    setPage(0);
  }, [debounced, sel]);

  useEffect(() => {
    let gone = false;
    (async () => {
      const url = debounced.trim() ? `/.netlify/functions/search-quests?q=${encodeURIComponent(debounced)}` : `/.netlify/functions/search-quests?q=*`;
      const r = await fetch(url);
      const data = await r.json();
      if (!gone) {
        setHits(data);
        track("quest_search", { q: debounced, n: data.length });
      }
    })();
    return () => { gone = true; };
  }, [debounced]);

  return (
    <section className="qsearch">
      <div className="row">
        <input
          value={q}
          onChange={(e)=>setQ(e.target.value)}
          placeholder="Search mini-quests (try: breath, focus, sleep)…"
          aria-label="Search quests"
        />
        <button onClick={()=>{ setQ(""); setSel([]); }}>Clear</button>
      </div>

      <div className="tags">
        {TAGS.map(t => (
          <button
            key={t}
            className={sel.includes(t) ? "tag sel" : "tag"}
            onClick={() => setSel(s => s.includes(t) ? s.filter(x => x!==t) : [...s, t])}
          >{t}</button>
        ))}
      </div>

      <ul className="grid">
        {slice.map(h => (
          <li key={h.id} className="card">
            <a href={`/quests/${h.id}`}>
              <strong>{h.title}</strong>
              <div className="muted">{h.summary || ""}</div>
              {!!(h.tags||[]).length && (
                <div className="microtags">
                  {(h.tags||[]).slice(0,4).map(t => <span key={t} className="pill">{t}</span>)}
                </div>
              )}
            </a>
          </li>
        ))}
      </ul>

      {pages > 1 && (
        <div className="pager">
          <button disabled={page<=0} onClick={()=>setPage(p=>p-1)}>Prev</button>
          <span>Page {page+1} / {pages}</span>
          <button disabled={page>=pages-1} onClick={()=>setPage(p=>p+1)}>Next</button>
        </div>
      )}

      <style>{`
        .qsearch .row{display:flex;gap:8px;align-items:center}
        .qsearch input{flex:1;padding:10px;border:1px solid #e5e7eb;border-radius:10px}
        .tags{display:flex;gap:8px;flex-wrap:wrap;margin:10px 0}
        .tag{border:1px solid #e5e7eb;border-radius:999px;padding:4px 10px;background:#fff}
        .tag.sel{background:#eef2ff;border-color:#c7d2fe}
        .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:12px;margin-top:10px}
        .card{border:1px solid #e5e7eb;border-radius:12px;background:#fff}
        .card a{display:block;padding:10px}
        .microtags{display:flex;gap:6px;margin-top:6px;flex-wrap:wrap}
        .pager{display:flex;gap:10px;align-items:center;justify-content:center;margin-top:10px}
      `}</style>
    </section>
  );
}

function useDebounce<T>(value:T, ms:number){ const [v,setV]=useState(value); useEffect(()=>{ const t=setTimeout(()=>setV(value),ms); return ()=>clearTimeout(t); },[value,ms]); return v; }
