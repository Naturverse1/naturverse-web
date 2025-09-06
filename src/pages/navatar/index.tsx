import { useEffect, useMemo, useState } from "react";
import Breadcrumbs from "../../components/Breadcrumbs";
import NavatarTabs from "../../components/NavatarTabs";
import NavatarImage from "../../components/NavatarImage";
import CharacterCardView from "../../components/CharacterCard";
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
      <div className="nv-hub-grid" style={{ marginTop: 8 }}>
        <section>
          <div className="nv-panel">
            <NavatarImage src={activeNavatar?.imageDataUrl} alt={activeNavatar?.name} />
          </div>
        </section>

        <aside className="nv-panel">
          <CharacterCardView card={card} />

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
