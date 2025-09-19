import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { WORLDS, WorldKey } from "../data/worlds";
import type { PassportStamp, PassportBadge } from "../types/passport";
import Breadcrumbs from "../components/Breadcrumbs";
import { setTitle } from "./_meta";

const LS_STAMPS = "naturverse.passport.stamps.v1";
const LS_BADGES = "naturverse.passport.badges.v1";

export default function PassportPage() {
  setTitle("Passport");
  const [uid, setUid] = useState<string | null>(null);
  const [usingLocal, setUsingLocal] = useState(true);
  const [loading, setLoading] = useState(true);
  const [tick, setTick] = useState(0);

  const [stamps, setStamps] = useState<PassportStamp[]>(() => {
    try { return JSON.parse(localStorage.getItem(LS_STAMPS) || "[]"); } catch { return []; }
  });
  const [badges, setBadges] = useState<PassportBadge[]>(() => {
    try { return JSON.parse(localStorage.getItem(LS_BADGES) || "[]"); } catch { return []; }
  });

  useEffect(() => { if (usingLocal) localStorage.setItem(LS_STAMPS, JSON.stringify(stamps)); }, [stamps, usingLocal]);
  useEffect(() => { if (usingLocal) localStorage.setItem(LS_BADGES, JSON.stringify(badges)); }, [badges, usingLocal]);

  useEffect(() => {
    const onGrant = () => setTick(t => t + 1);
    window.addEventListener("natur:stamp-granted", onGrant);
    return () => window.removeEventListener("natur:stamp-granted", onGrant);
  }, []);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      const u = data.session?.user?.id ?? null;
      setUid(u);
      if (!u) { setLoading(false); return; }
      try {
        const { data: s, error: es } = await supabase
          .from("passport_stamps")
          .select("id,user_id,world,title,note,created_at")
          .eq("user_id", u)
          .order("created_at", { ascending: false });
        if (es) throw es;

        const { data: b, error: eb } = await supabase
          .from("passport_badges")
          .select("id,user_id,code,label,created_at")
          .eq("user_id", u)
          .order("created_at", { ascending: false });
        if (eb) throw eb;

        setStamps((s || []) as PassportStamp[]);
        setBadges((b || []) as PassportBadge[]);
        setUsingLocal(false);
      } catch {
        setUsingLocal(true);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const progressByWorld = useMemo(() => {
    const map: Record<string, number> = {};
    for (const w of WORLDS) map[w.slug] = 0;
    for (const s of stamps) map[s.world] = (map[s.world] || 0) + 1;
    return map;
  }, [stamps]);

  async function addStamp(world: WorldKey, title: string, note?: string) {
    const base: Omit<PassportStamp, "id" | "created_at"> = {
      user_id: uid || "local", world, title, note: note || null,
    };
    if (uid && !usingLocal) {
      const { data, error } = await supabase
        .from("passport_stamps")
        .insert(base)
        .select("id,user_id,world,title,note,created_at")
        .single();
      if (error) { alert(error.message); return; }
      setStamps(prev => [data as PassportStamp, ...prev]);
    } else {
      const local: PassportStamp = { ...base, id: String(Date.now()), created_at: new Date().toISOString() };
      setStamps(prev => [local, ...prev]);
    }
  }

  async function grantBadge(code: string, label: string) {
    const base: Omit<PassportBadge, "id" | "created_at"> = {
      user_id: uid || "local", code, label,
    };
    if (uid && !usingLocal) {
      const { data, error } = await supabase
        .from("passport_badges")
        .insert(base)
        .select("id,user_id,code,label,created_at")
        .single();
      if (error) { alert(error.message); return; }
      setBadges(prev => [data as PassportBadge, ...prev]);
    } else {
      const local: PassportBadge = { ...base, id: String(Date.now()), created_at: new Date().toISOString() };
      setBadges(prev => [local, ...prev]);
    }
  }

  function demoStamp(world: WorldKey) {
    addStamp(world, "Explorer Stamp", "Demo progress");
  }

  function demoBadge() {
    grantBadge("first-steps", "First Steps");
  }

  if (loading)
    return (
      <div className="nvrs-section passport page-wrap nv-secondary-scope">
        <Breadcrumbs />
        <main id="main" data-page="passport" className="passport"><h1>Passport</h1><p>Loading…</p></main>
      </div>
    );

  return (
    <div className="nvrs-section passport page-wrap nv-secondary-scope">
      <Breadcrumbs />
      <main id="main" data-page="passport" className="passport">
      <h1>Passport</h1>
      <p className="muted">{usingLocal ? "Local demo mode." : "Synced to your account."}</p>

      <section className="panel">
        <h2>World Stamps</h2>
        <div className="world-grid">
          {WORLDS.map((w) => (
            <div key={w.slug} className="world-card">
              <div className="world-name">{titleCase(w.slug)}</div>
              <div className="stamp-count">
                {progressByWorld[w.slug]} stamp{progressByWorld[w.slug] === 1 ? "" : "s"}
              </div>
              <button className="btn tiny" onClick={() => demoStamp(w.slug as WorldKey)}>Add demo stamp</button>
            </div>
          ))}
        </div>
      </section>

      <section className="panel">
        <h2>Recent Stamps</h2>
        {stamps.length === 0 ? (
          <p className="muted">No stamps yet. Add one using the world cards above.</p>
        ) : (
          <ul className="stamp-list">
            {stamps.map(s => (
              <li key={s.id} className="stamp-item">
                <span className="w">{titleCase(s.world)}</span>
                <span className="t">{s.title}</span>
                <span className="n">{s.note || ""}</span>
                <span className="d">{s.created_at ? new Date(s.created_at).toLocaleString() : ""}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="panel">
        <h2>Badges</h2>
        <div className="row">
          <button className="btn" onClick={demoBadge}>Grant demo badge</button>
        </div>
        {badges.length === 0 ? (
          <p className="muted">No badges yet.</p>
        ) : (
          <div className="badge-grid">
            {badges.map(b => (
              <div key={b.id} className="badge">
                <div className="badge-icon">🏅</div>
                <div className="badge-body">
                  <div className="badge-label">{b.label}</div>
                  <div className="badge-code">{b.code}</div>
                  <div className="badge-date">{b.created_at ? new Date(b.created_at).toLocaleDateString() : ""}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <p className="muted small">Coming soon: auto-stamps from quizzes, stories, and missions.</p>
    </main>
    </div>
  );
}

function titleCase(s: string) {
  return s.replace(/(^|\s|-)\w/g, (m) => m.toUpperCase());
}

