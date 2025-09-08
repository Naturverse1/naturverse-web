import React, { useEffect, useMemo, useState } from "react";
import NavatarTabs from "../../components/NavatarTabs";
import { Link } from "react-router-dom";
import {
  fetchActiveNavatar,
  fetchMyCharacterCard,
  loadActiveId,
} from "../../lib/navatar";
import "../../styles/navatar.css";

export default function MyNavatarPage() {
  const [avatar, setAvatar] = useState<ReturnType<typeof Object> | null>(null);
  const [card, setCard] = useState<any | null>(null);
  const activeId = useMemo(() => loadActiveId(), []);

  useEffect(() => {
    let alive = true;
    (async () => {
      const a = await fetchActiveNavatar();
      const c = await fetchMyCharacterCard();
      if (!alive) return;
      setAvatar(a);
      setCard(c);
    })();
    return () => {
      alive = false;
    };
  }, [activeId]);

  return (
    <main className="container page-pad">
      <h1 className="center page-title">My Navatar</h1>
      <NavatarTabs />

      <div className="nv-hub-grid" style={{ marginTop: 16 }}>
        <section className="nv-panel">
          <div>
            {!avatar ? (
              <div className="nav-card__placeholder" aria-busy="true" />
            ) : (
              <figure className="nav-card">
                <div className="nav-card__img" aria-label="Navatar">
                  <img src={avatar.image_url || ""} alt={avatar.name || "Navatar"} />
                </div>
                <figcaption className="nav-card__cap">
                  <strong>{avatar.name || "My Navatar"}</strong>
                </figcaption>
              </figure>
            )}
          </div>
        </section>

        <aside className="nv-panel">
          <div className="nv-title">Character Card</div>
          {!card ? (
            <p>
              No card yet. <Link to="/navatar/card">Create Card</Link>
            </p>
          ) : (
            <dl className="nv-list">
              {card.name && (
                <>
                  <dt>Name</dt>
                  <dd>{card.name}</dd>
                </>
              )}
              {card.species && (
                <>
                  <dt>Species</dt>
                  <dd>{card.species}</dd>
                </>
              )}
              {card.kingdom && (
                <>
                  <dt>Kingdom</dt>
                  <dd>{card.kingdom}</dd>
                </>
              )}
              {card.backstory && (
                <>
                  <dt>Backstory</dt>
                  <dd>{card.backstory}</dd>
                </>
              )}
              {card.powers && card.powers.length > 0 && (
                <>
                  <dt>Powers</dt>
                  <dd>{card.powers.map((p: string) => `— ${p}`).join("  ")}</dd>
                </>
              )}
              {card.traits && card.traits.length > 0 && (
                <>
                  <dt>Traits</dt>
                  <dd>{card.traits.map((t: string) => `— ${t}`).join("  ")}</dd>
                </>
              )}
            </dl>
          )}
          <div style={{ marginTop: 12 }}>
            <Link to="/navatar/card" className="btn">
              Edit Card
            </Link>
          </div>
        </aside>
      </div>
    </main>
  );
}
