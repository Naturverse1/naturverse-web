import React from "react";
import { WORLDS } from "../../data/worlds";
import WorldCard from "../../components/WorldCard";
import { SkeletonCard } from "../../components/Skeleton";
import "../../components/worlds.css";

type Filters = {
  q: string;
  kingdom: string; // "" or one of kingdoms
  minDiff: number; // 1..5
};

const KINGDOMS = [
  "Air",
  "Water",
  "Earth",
  "Fire",
  "Light",
  "Shadow",
  "Mind",
  "Heart",
];

export default function WorldsExplorer() {
  const [filters, setFilters] = React.useState<Filters>(() => {
    const sp = new URLSearchParams(location.search);
    return {
      q: sp.get("q") || "",
      kingdom: sp.get("kingdom") || "",
      minDiff: Number(sp.get("min") || 1),
    };
  });
  const [sharingMsg, setSharingMsg] = React.useState<string>("");

  React.useEffect(() => {
    const sp = new URLSearchParams();
    if (filters.q) sp.set("q", filters.q);
    if (filters.kingdom) sp.set("kingdom", filters.kingdom);
    if (filters.minDiff > 1) sp.set("min", String(filters.minDiff));
    const next = `${location.pathname}?${sp.toString()}`;
    history.replaceState(null, "", next);
  }, [filters]);

  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    const t = setTimeout(() => setLoading(false), 250);
    return () => clearTimeout(t);
  }, []);

  const list = WORLDS.filter((w) => {
    const passQ =
      !filters.q ||
      w.name.toLowerCase().includes(filters.q.toLowerCase()) ||
      w.summary.toLowerCase().includes(filters.q.toLowerCase()) ||
      (w.tags || []).some((t) => t.toLowerCase().includes(filters.q.toLowerCase()));
    const passK = !filters.kingdom || w.kingdom === filters.kingdom;
    const passD = w.difficulty >= filters.minDiff;
    return passQ && passK && passD;
  });

  return (
    <main style={{ maxWidth: 1100, margin: "24px auto", padding: "0 20px" }}>
      <h1 style={{ marginBottom: 10 }}>Worlds Explorer</h1>
      <p style={{ opacity: 0.8, marginTop: 0 }}>
        Search worlds by theme, filter by kingdom, and choose your next quest.
      </p>

      <div className="worlds-toolbar" role="search">
        <input
          type="search"
          placeholder="Search worlds (e.g., breath, courage)…"
          value={filters.q}
          onChange={(e) => setFilters((f) => ({ ...f, q: e.target.value }))}
          aria-label="Search worlds"
        />
        <select
          aria-label="Filter by kingdom"
          value={filters.kingdom}
          onChange={(e) => setFilters((f) => ({ ...f, kingdom: e.target.value }))}
        >
          <option value="">All kingdoms</option>
          {KINGDOMS.map((k) => (
            <option key={k} value={k}>
              {k}
            </option>
          ))}
        </select>
        <label className="min-diff">
          Min difficulty:
          <input
            type="range"
            min={1}
            max={5}
            value={filters.minDiff}
            onChange={(e) => setFilters((f) => ({ ...f, minDiff: Number(e.target.value) }))}
          />
          <span>{filters.minDiff}/5</span>
        </label>
      </div>

      {sharingMsg && (
        <div className="worlds-toast" role="status" aria-live="polite">
          Link copied: <code>{sharingMsg}</code>
        </div>
      )}

      {loading ? (
        <div className="worlds-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : (
        <>
          <p className="worlds-count">
            {list.length} world{list.length === 1 ? "" : "s"}
          </p>
          <div className="worlds-grid">
            {list.map((w) => (
              <WorldCard
                key={w.id}
                name={w.name}
                summary={w.summary}
                slug={w.slug}
                kingdom={w.kingdom}
                zones={w.zones}
                difficulty={w.difficulty}
                image={w.image}
                onShare={(u) => {
                  setSharingMsg(u);
                  setTimeout(() => setSharingMsg(""), 1800);
                }}
              />
            ))}
          </div>
        </>
      )}
    </main>
  );
}

