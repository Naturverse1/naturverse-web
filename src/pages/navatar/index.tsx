import { useEffect, useMemo, useState } from "react";
import Breadcrumbs from "../../components/Breadcrumbs";
import NavatarTabs from "../../components/NavatarTabs";
import NavatarCard from "../../components/NavatarCard";
import { loadActive } from "../../lib/localStorage";
import { fetchMyCharacterCard, type CharacterCard } from "../../lib/navatar";
import { Link } from "react-router-dom";
import "../../styles/navatar.css";

export default function MyNavatarPage() {
  const activeNavatar = useMemo(() => loadActive<any>(), []);
  const [card, setCard] = useState<CharacterCard | null>(null);

  useEffect(() => {
    let alive = true;
    if (!activeNavatar?.id) {
      setCard(null);
      return;
    }
    (async () => {
      try {
        const c = await fetchMyCharacterCard(activeNavatar.id);
        if (alive) setCard(c);
      } catch {
        // ignore
      }
    })();
    return () => {
      alive = false;
    };
  }, [activeNavatar?.id]);

  return (
    <main className="container page-pad">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/navatar", label: "Navatar" }]} />
      <h1 className="center page-title">My Navatar</h1>
      <NavatarTabs color="blue" />
      <div className="nv-hub-grid" style={{ marginTop: 8 }}>
        <section>
          <div className="nv-panel">
            <NavatarCard src={activeNavatar?.imageDataUrl} title={activeNavatar?.name || "Turian"} />
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
                  <dd>{card.powers.map(p => `— ${p}`).join("\n")}</dd>
                </>
              )}
              {card.traits && card.traits.length > 0 && (
                <>
                  <dt>Traits</dt>
                  <dd>{card.traits.map(t => `— ${t}`).join("\n")}</dd>
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
