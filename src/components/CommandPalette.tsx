import { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { score } from "../utils/fuzzy";
import { smartShare } from "../utils/share";
import { track } from "../utils/telemetry";

type Item = { id: string; label: string; href?: string; action?: () => void; group?: string };

const ROUTES: Item[] = [
  { id: "home", label: "Home", href: "/" , group: "Navigate"},
  { id: "worlds", label: "Worlds", href: "/worlds", group: "Navigate"},
  { id: "zones", label: "Zones", href: "/zones", group: "Navigate"},
  { id: "market", label: "Marketplace", href: "/marketplace", group: "Navigate"},
  { id: "passport", label: "Passport", href: "/passport", group: "Navigate"},
  { id: "naturbank", label: "NaturBank", href: "/naturbank", group: "Navigate"},
  { id: "navatar", label: "Navatar", href: "/navatar", group: "Navigate"},
  // Actions
  { id: "share", label: "Share this page", group: "Actions", action: async () => {
      const res = await smartShare({ title: document.title });
      track.click("palette_share", { res });
    }},
  { id: "clear", label: "Clear local library", group: "Actions", action: () => {
      localStorage.clear(); track.click("palette_clear");
      alert("Local data cleared.");
    }},
];

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const loc = useLocation();

  // close on route change
  useEffect(() => { setOpen(false); setQ(""); }, [loc.pathname]);

  // keyboard
  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      const mod = e.ctrlKey || e.metaKey;
      if (mod && e.key.toLowerCase() === "k") { e.preventDefault(); setOpen(o => !o); }
      if (e.key === "Escape") setOpen(false);
      if (!open && e.key === "?") setOpen(true);
    };
    addEventListener("keydown", on);
    return () => removeEventListener("keydown", on);
  }, [open]);

  const results = useMemo(() => {
    const items = ROUTES;
    if (!q) return items;
    const scored = items
      .map(i => ({ i, s: score(q, i.label) }))
      .filter(x => x.s > 0)
      .sort((a,b)=> b.s - a.s)
      .map(x => x.i);
    track.search(q, scored.length);
    return scored;
  }, [q]);

  if (!open) return null;

  return (
    <div role="dialog" aria-modal="true" aria-label="Command palette"
      style={{
        position: "fixed", inset: 0, background: "rgba(7,17,35,.36)",
        display: "grid", placeItems: "start center", paddingTop: "12vh", zIndex: 9998
      }}
      onClick={() => setOpen(false)}
    >
      <div onClick={(e)=>e.stopPropagation()}
        style={{
          width: "min(720px, 92vw)", background: "white", borderRadius: 16,
          boxShadow: "0 30px 80px rgba(0,0,0,.25)", overflow: "hidden"
        }}>
        <div style={{ padding: 14, borderBottom: "1px solid #ecf0ff" }}>
          <input autoFocus value={q} onChange={(e)=>setQ(e.target.value)}
            placeholder="Search pages and actions…"
            style={{ width:"100%", padding:"12px 14px", borderRadius: 10, border:"1px solid #dfe7ff" }}/>
        </div>
        <div style={{ maxHeight: "50vh", overflow: "auto" }}>
          {results.length === 0 && (
            <div style={{ padding: 18, opacity:.7 }}>No results.</div>
          )}
          {results.map((r, idx) => (
            <button key={r.id}
              onClick={() => {
                setOpen(false);
                if (r.href) navigate(r.href);
                else r.action?.();
              }}
              className="palette-row"
              style={{
                display:"flex", width:"100%", textAlign:"left",
                padding: "12px 16px", gap:10, borderTop: idx? "1px solid #f3f6ff":"none",
                background:"white"
              }}
              >
              <span style={{ color:"#0b2545" }}>{r.label}</span>
              {r.group && <span style={{ marginLeft:"auto", fontSize:12, opacity:.6 }}>{r.group}</span>}
            </button>
          ))}
        </div>
        <div style={{ padding:"8px 12px", fontSize:12, color:"#5b6e99", background:"#f7f9ff", display:"flex", gap:14 }}>
          <span>⌘/Ctrl + K</span><span>·</span><span>Esc to close</span><span>·</span><span>?</span>
        </div>
      </div>
    </div>
  );
}
