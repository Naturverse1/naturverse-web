import { useEffect, useMemo, useState } from "react";
import { supabase } from "../supabase/client";
import type { PassportStamp } from "../types/passport";

const LS_KEY = "naturverse.passport.v1";

const WORLDS = [
  "Thailandia","Chinadia","Japonica","Indiania","Brazilia","Africania",
  "Europalia","Britannula","Americandia","Australandia","Kiwlandia",
  "Madagascaria","Greenlandia","Antarcticland",
];

export default function PassportPage() {
  const [uid, setUid] = useState<string | null>(null);
  const [stamps, setStamps] = useState<PassportStamp[]>(() => {
    try { return JSON.parse(localStorage.getItem(LS_KEY) || "[]"); } catch { return []; }
  });
  const [usingLocal, setUsingLocal] = useState(true);
  const [loading, setLoading] = useState(true);
  const [world, setWorld] = useState<string>(WORLDS[0]);
  const [badge, setBadge] = useState<string>("");
  const [note, setNote] = useState<string>("");

  useEffect(() => { if (usingLocal) localStorage.setItem(LS_KEY, JSON.stringify(stamps)); }, [stamps, usingLocal]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      const u = data.session?.user?.id ?? null;
      setUid(u);
      if (!u) { setLoading(false); return; }

      try {
        const { data: rows, error } = await supabase
          .from("passport_stamps")
          .select("id,user_id,world,badge,note,created_at")
          .eq("user_id", u)
          .order("created_at", { ascending: false })
          .limit(200);
        if (error) throw error;
        setStamps((rows || []) as PassportStamp[]);
        setUsingLocal(false);
      } catch {
        setUsingLocal(true);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const earnedByWorld = useMemo(() => {
    const map = new Map<string, number>();
    for (const w of WORLDS) map.set(w, 0);
    for (const s of stamps) map.set(s.world, (map.get(s.world) || 0) + 1);
    return map;
  }, [stamps]);

  async function addStamp() {
    const s: Omit<PassportStamp, "id" | "created_at" | "user_id"> = { world, badge: badge || null, note: note || null };
    if (uid && !usingLocal) {
      const { data, error } = await supabase
        .from("passport_stamps")
        .insert({ user_id: uid, world: s.world, badge: s.badge, note: s.note })
        .select("id,user_id,world,badge,note,created_at")
        .single();
      if (error) { alert(error.message); return; }
      setStamps(prev => [data as PassportStamp, ...prev]);
    } else {
      const loc: PassportStamp = {
        id: String(Date.now()),
        user_id: "local",
        world: s.world,
        badge: s.badge,
        note: s.note,
        created_at: new Date().toISOString(),
      };
      setStamps(prev => [loc, ...prev]);
    }
    setBadge(""); setNote("");
  }

  async function removeStamp(id: string) {
    if (uid && !usingLocal) { await supabase.from("passport_stamps").delete().eq("id", id); }
    setStamps(prev => prev.filter(x => x.id !== id));
  }

  if (loading) return <main><h1>Passport</h1><p>Loading…</p></main>;

  return (
    <main className="passport">
      <h1>Passport</h1>
      <p className="muted">
        {usingLocal ? "Local demo mode (not signed in)." : "Synced to your account."}
      </p>

      <section className="passport-summary">
        {WORLDS.map(w => (
          <div key={w} className="stamp-box">
            <div className="w">{w}</div>
            <div className="c">{earnedByWorld.get(w) || 0} stamp(s)</div>
          </div>
        ))}
      </section>

      <section className="panel">
        <h2>Add Stamp</h2>
        <div className="row wrap">
          <label className="field">
            <span>World</span>
            <select value={world} onChange={e => setWorld(e.target.value)}>
              {WORLDS.map(w => <option key={w} value={w}>{w}</option>)}
            </select>
          </label>
          <label className="field">
            <span>Badge (optional)</span>
            <input value={badge} onChange={e => setBadge(e.target.value)} placeholder="Explorer, Helper, Champion…" />
          </label>
          <label className="field grow">
            <span>Note (optional)</span>
            <input value={note} onChange={e => setNote(e.target.value)} placeholder="Finished Songkran quest!" />
          </label>
          <button className="btn" onClick={addStamp}>Add</button>
        </div>
      </section>

      <section className="panel">
        <h2>Recent Stamps</h2>
        {stamps.length === 0 ? (
          <p className="muted">No stamps yet. Earn stamps by completing quests and lessons.</p>
        ) : (
          <ul className="stamp-list">
            {stamps.map(s => (
              <li key={s.id} className="stamp-item">
                <div className="col main">
                  <div className="top">
                    <strong>{s.world}</strong>
                    <span className="when">{s.created_at ? new Date(s.created_at).toLocaleString() : ""}</span>
                  </div>
                  {s.badge && <div className="badge">🏅 {s.badge}</div>}
                  {s.note && <div className="note">{s.note}</div>}
                </div>
                <div className="col actions">
                  <button className="btn outline tiny" onClick={() => removeStamp(s.id)}>Remove</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <p className="muted small">Coming soon: auto-stamps from Quests, World boss events, and teacher-verified badges.</p>
    </main>
  );
}

