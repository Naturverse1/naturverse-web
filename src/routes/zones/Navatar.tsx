import { useEffect, useMemo, useState } from "react";
import TraitSelector from "@/components/navatar/TraitSelector";
import Preview from "@/components/navatar/Preview";
import { makeNavatarSVG, saveNavatar, fetchNavatar, type NavatarTraits } from "@/lib/navatar";
import { supabase } from "@/supabaseClient";

const DEFAULT: NavatarTraits = {
  realm: "fruit",
  species: "Durian",
  color: "#7dd3fc",
  eyes: "happy",
  accessory: "none",
};

export default function NavatarCreator() {
  const [userId, setUserId] = useState<string | null>(null);
  const [traits, setTraits] = useState<NavatarTraits>(DEFAULT);
  const svg = useMemo(() => makeNavatarSVG(traits), [traits]);
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!supabase) { setLoaded(true); return; }
    supabase.auth.getUser().then(({ data }) => {
      const uid = data.user?.id ?? null;
      setUserId(uid);
      if (uid) init(uid);
      else setLoaded(true);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function init(uid: string) {
    try {
      const existing = await fetchNavatar(uid);
      if (existing) {
        setTraits(existing.traits);
      }
    } finally {
      setLoaded(true);
    }
  }

  async function onSave() {
    if (!userId) {
      alert("Please sign in to save your Navatar.");
      return;
    }
    setSaving(true);
    try {
      await saveNavatar(userId, traits);
      alert("Navatar saved! You can now use it across worlds and in the marketplace.");
    } finally {
      setSaving(false);
    }
  }

  function downloadSVG() {
    const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "navatar.svg"; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <h3>Create your Navatar ✨</h3>
      <p className="muted">Pick a realm, species, colors and accessories. Save to use it in Worlds, Arcade, and the Marketplace.</p>

      {!loaded ? <p>Loading…</p> : (
        <div className="grid-2 gap-6">
          <div className="stack gap-4">
            <TraitSelector value={traits} onChange={setTraits}/>
            <div className="row gap-2">
              <button onClick={onSave} disabled={saving}>{saving ? "Saving…" : "Save Navatar"}</button>
              <button onClick={downloadSVG} type="button">Download SVG</button>
            </div>
            {!userId && <div className="note">Tip: sign in to save your Navatar to your profile.</div>}
          </div>
          <Preview svg={svg}/>
        </div>
      )}

      <style>{`
        .grid-2 { display:grid; grid-template-columns: 1fr; }
        @media(min-width: 900px){ .grid-2{ grid-template-columns: 1fr 1fr; } }
        .stack{ display:flex; flex-direction:column; }
        .row{ display:flex; align-items:center; }
        .wrap{ flex-wrap: wrap; }
        .gap-2{ gap:8px; } .gap-3{ gap:12px; } .gap-4{ gap:16px; } .gap-6{ gap:24px; }
        .chip{ padding:6px 10px; border:1px solid #cbd5e1; border-radius:999px; background:#fff; }
        .chip--active{ background:#111; color:#fff; border-color:#111; }
        label{ display:block; font-weight:600; margin-bottom:6px; }
        select{ padding:8px; border-radius:8px; border:1px solid #cbd5e1; background:#fff; }
        button{ padding:10px 14px; border-radius:10px; border:1px solid #0f172a; background:#0f172a; color:#fff; }
        .muted{ color:#64748b; }
        .note{ font-size: 14px; color:#0f172a; background:#f1f5f9; padding:10px; border-radius:8px; }
      `}</style>
    </>
  );
}
