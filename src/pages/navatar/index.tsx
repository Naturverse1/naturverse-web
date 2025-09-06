import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import NavatarTabs from "../../components/NavatarTabs";
import NavatarCard from "../../components/NavatarCard";
import { loadActive } from "../../lib/localStorage";
import { getCard, loadPrimaryNavatarId } from "../../lib/card";
import "../../styles/navatar.css";

export default function MyNavatarPage() {
  const activeNavatar = useMemo(() => loadActive<any>(), []);
  const [card, setCard] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const id = await loadPrimaryNavatarId();
      if (!id) return;
      try {
        setCard(await getCard(id));
      } catch (err) {
        console.warn(err);
      }
    })();
  }, []);

  return (
    <main className="container">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/navatar", label: "Navatar" }]} />
      <h1 className="center">My Navatar</h1>
      <NavatarTabs />

      <div className="nav-stack" style={{ marginTop: 8 }}>
        <NavatarCard src={activeNavatar?.imageDataUrl} title={activeNavatar?.name || "Turian"} />

        <div className="char-card">
          <h3>Character Card</h3>
          {card ? (
            <dl className="char-card__dl">
              <div><strong>Name</strong><div>{card.name ?? "—"}</div></div>
              <div><strong>Species</strong><div>{card.species ?? "—"}</div></div>
              <div><strong>Kingdom</strong><div>{card.kingdom ?? "—"}</div></div>
              <div><strong>Backstory</strong><div className="pre">{card.backstory || "—"}</div></div>
              <div><strong>Powers</strong><div className="pre">{(card.powers || []).length ? (card.powers || []).map((p: string) => <div key={p}>— {p}</div>) : "—"}</div></div>
              <div><strong>Traits</strong><div className="pre">{(card.traits || []).length ? (card.traits || []).map((t: string) => <div key={t}>— {t}</div>) : "—"}</div></div>
            </dl>
          ) : (
            <div>No card yet. <Link to="/navatar/card">Create Card</Link></div>
          )}

          <div style={{ marginTop: 16 }}>
            <Link to="/navatar/card" className="pill">Edit Card</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
