import { useEffect, useMemo, useState } from "react";
import Breadcrumbs from "../../components/Breadcrumbs";
import NavatarTabs from "../../components/NavatarTabs";
import NavatarCard from "../../components/NavatarCard";
import { loadActive } from "../../lib/localStorage";
import { fetchMyCharacterCard } from "../../lib/navatar";
import type { CharacterCard } from "../../lib/types";
import { Link } from "react-router-dom";
import "../../styles/navatar.css";

export default function MyNavatarPage() {
  const activeNavatar = useMemo(() => loadActive<any>(), []);
  const [card, setCard] = useState<CharacterCard | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const c = await fetchMyCharacterCard();
        if (alive) setCard(c);
      } catch {
        // ignore
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <main className="container page-pad">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/navatar", label: "Navatar" }]} />
      <h1 className="center page-title">My Navatar</h1>
      <NavatarTabs />

      <div style={{ marginTop: 8 }}>
        <NavatarCard src={activeNavatar?.imageDataUrl} title={activeNavatar?.name || "Turian"} />
      </div>

      <section className="panel" style={{ marginTop: 16 }}>
        <h3 className="panel-title">Character Card</h3>
        {!card ? (
          <p>
            No card yet. <Link to="/navatar/card" className="link">Create Card</Link>
          </p>
        ) : (
          <div className="cc-summary">
            {card.name && (
              <div>
                <strong>Name:</strong> {card.name}
              </div>
            )}
            {card.species && (
              <div>
                <strong>Species:</strong> {card.species}
              </div>
            )}
            {card.kingdom && (
              <div>
                <strong>Kingdom:</strong> {card.kingdom}
              </div>
            )}
            {card.backstory && (
              <div className="mt-sm">
                <strong>Backstory</strong>
                <div>{card.backstory}</div>
              </div>
            )}
            {card.powers && card.powers.length > 0 && (
              <div className="mt-sm">
                <strong>Powers</strong>
                <div>— {card.powers.join(", ")}</div>
              </div>
            )}
            {card.traits && card.traits.length > 0 && (
              <div className="mt-sm">
                <strong>Traits</strong>
                <div>— {card.traits.join(", ")}</div>
              </div>
            )}
            <div className="mt-md">
              <Link to="/navatar/card" className="pill">
                Edit Card
              </Link>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
