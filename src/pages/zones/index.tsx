import React from "react";
import { ZONES } from "../../data/zones";
import "../../components/market.css";
import "./zones-unlock.css";
import { getUnlockedZones, localUnlockZone } from "../../lib/progress";

export default function ZonesPage() {
  // Replace with real auth user id when wired
  const userId = "demo-user-123";
  const [unlocked, setUnlocked] = React.useState<Set<string>>(new Set());
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      const set = await getUnlockedZones(userId);
      if (active) setUnlocked(set);
      setLoading(false);
    })();
    return () => { active = false; };
  }, [userId]);

  function mockUnlock(slug: string) {
    // Dev-friendly demo: lets you unlock locally
    localUnlockZone(userId, slug);
    setUnlocked(new Set([...Array.from(unlocked), slug]));
  }

  return (
    <main style={{ maxWidth: 1100, margin: "24px auto", padding: "0 20px" }}>
      <h1 style={{ marginBottom: 10 }}>Zones Explorer</h1>
      <p style={{ opacity: .8, marginTop: 0 }}>
        Discover the magical regions of the Naturverse. Locked zones show a padlock until you earn a stamp.
      </p>

      <div className="market-grid">
        {ZONES.map(z => {
          const isUnlocked = unlocked.has(z.slug);
          return (
            <article key={z.slug} className={`product zone-card ${isUnlocked ? "is-unlocked" : "is-locked"}`}>
              <a
                className="product__image"
                href={isUnlocked ? `/zones/${z.slug}` : `/zones/${z.slug}`}
                aria-label={`Open ${z.name}`}
              >
                <div className="zone-emoji">{z.emoji}</div>
                {!isUnlocked && <div className="zone-lock" aria-hidden="true">🔒</div>}
                {isUnlocked && <div className="zone-ribbon">UNLOCKED</div>}
              </a>

              <div className="product__body">
                <h3 className="product__title">
                  <a href={`/zones/${z.slug}`}>{z.name}</a>
                </h3>
                <p className="product__meta">
                  <span className="product__cat">{z.region}</span>
                </p>
                <p className="product__summary">{z.summary}</p>

                <div className="product__actions">
                  {isUnlocked ? (
                    <a className="btn" href={`/zones/${z.slug}`}>Explore</a>
                  ) : (
                    <>
                      <a className="btn ghost" href="/progress">Earn stamp to unlock</a>
                      {/* Dev/demo helper; remove when auth is wired */}
                      <button className="btn ghost" onClick={() => mockUnlock(z.slug)} title="Dev unlock (local)">
                        Dev unlock
                      </button>
                    </>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {loading && <p style={{ opacity: .6, marginTop: 12 }}>Syncing your unlocks…</p>}
    </main>
  );
}
