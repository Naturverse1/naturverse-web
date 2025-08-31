import React from "react";
import { search, type SearchDoc } from "../search";
import { SearchCtx } from "../search/SearchProvider";
import "./search.css";

export default function SearchBar() {
  const [q, setQ] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [results, setResults] = React.useState<SearchDoc[]>([]);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const { docs } = React.useContext(SearchCtx);

  React.useEffect(() => {
    if (!q.trim()) { setResults([]); return; }
    setResults(search(docs, q, 8));
  }, [q, docs]);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "/" && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="nv-search">
      <input
        ref={inputRef}
        className="nv-search__input"
        type="search"
        placeholder="Search worlds, zones, marketplace, quests…  (press / )"
        value={q}
        onChange={(e) => { setQ(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        aria-label="Global search"
      />
      {open && (q || results.length) ? (
        <div className="nv-search__panel" role="listbox">
          {results.length === 0 ? (
            <div className="nv-search__empty">No results yet. Try another word.</div>
          ) : results.map((r) => (
            <a key={`${r.type}:${r.id}`} className="nv-search__item" href={r.url} role="option">
              <span className={`nv-search__tag t-${r.type}`}>{r.type}</span>
              <div className="nv-search__text">
                <div className="nv-search__title">{r.title}</div>
                <div className="nv-search__sum">{r.summary}</div>
              </div>
            </a>
          ))}
          <a className="nv-search__more" href={`/search?q=${encodeURIComponent(q)}`}>See all results →</a>
        </div>
      ) : null}
    </div>
  );
}

