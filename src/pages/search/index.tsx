import React from "react";
import { search, type SearchDoc } from "../../search";
import "../../components/search.css";
import { SearchCtx } from "../../search/SearchProvider";

const TYPES = ["all", "world", "zone", "product", "quest"] as const;
type TypeFilter = typeof TYPES[number];

export default function SearchPage() {
  const sp = new URLSearchParams(location.search);
  const initialQ = sp.get("q") || "";

  const [q, setQ] = React.useState(initialQ);
  const [type, setType] = React.useState<TypeFilter>("all");
  const [results, setResults] = React.useState<SearchDoc[]>([]);
  const { docs } = React.useContext(SearchCtx);

  React.useEffect(() => {
    const all = search(docs, q, 100);
    const filtered = type === "all" ? all : all.filter(d => d.type === type);
    setResults(filtered);
  }, [q, type, docs]);

  React.useEffect(() => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (type !== "all") params.set("t", type);
    history.replaceState(null, "", `${location.pathname}?${params.toString()}`);
  }, [q, type]);

  return (
    <main style={{ maxWidth: 1100, margin: "24px auto", padding: "0 20px" }}>
      <h1>Search</h1>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", margin: "12px 0 18px" }}>
        <input
          type="search"
          className="nv-search__input"
          placeholder="Search the Naturverse…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          autoFocus
        />
        <div className="tabs" role="tablist" aria-label="Filter by type">
          {TYPES.map(t => (
            <button
              key={t}
              role="tab"
              aria-selected={t === type}
              className={`tab ${t === type ? "is-active" : ""}`}
              onClick={() => setType(t)}
            >
              {t[0].toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <p style={{ opacity: .7 }}>{results.length} result{results.length === 1 ? "" : "s"}</p>

      <div className="nv-search__panel" style={{ position: "static", boxShadow: "none" }}>
        {results.length === 0 ? (
          <div className="nv-search__empty">Nothing found. Try another phrase.</div>
        ) : results.map(r => (
          <a key={`${r.type}:${r.id}`} className="nv-search__item" href={r.url}>
            <span className={`nv-search__tag t-${r.type}`}>{r.type}</span>
            <div className="nv-search__text">
              <div className="nv-search__title">{r.title}</div>
              <div className="nv-search__sum">{r.summary}</div>
            </div>
          </a>
        ))}
      </div>
    </main>
  );
}

