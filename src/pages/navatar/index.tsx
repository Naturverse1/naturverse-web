import { useEffect, useState } from "react";
import NavatarCard from "../../components/NavatarCard";
import { fetchMyCharacterCard } from "../../lib/navatar";
import { loadActiveNavatar } from "../../lib/localNavatar";
import { Link } from "react-router-dom";
import "../../styles/navatar.css";

export default function MyNavatarPage() {
  const [card, setCard] = useState<any>(null);
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const c = await fetchMyCharacterCard();
        if (alive) setCard(c);
      } catch {}
    })();
    return () => { alive = false; };
  }, []);

  const active = loadActiveNavatar();

  return (
    <main className="container page-pad">
      <h1 className="center page-title">My Navatar</h1>
      <div className="nv-hub-grid">
        <section>
          <div className="nv-panel">
            <NavatarCard
              src={active ? `/images/avatars/${active}.jpg` : undefined /* or wherever your image URL comes from */}
              title={/* active navatar name if available */ undefined}
            />
          </div>
        </section>

        <aside className="nv-panel">
          <div className="nv-title">Character Card</div>
          {!card ? (
            <p>No card yet. <Link to="/navatar/card">Create Card</Link></p>
          ) : (
            <dl className="nv-list">
              {card.name && (<><dt>Name</dt><dd>{card.name}</dd></>)}
              {card.species && (<><dt>Species</dt><dd>{card.species}</dd></>)}
              {card.kingdom && (<><dt>Kingdom</dt><dd>{card.kingdom}</dd></>)}
              {card.backstory && (<><dt>Backstory</dt><dd>{card.backstory}</dd></>)}
              {card.powers?.length ? (<><dt>Powers</dt><dd>{card.powers.join(", ")}</dd></>) : null}
              {card.traits?.length ? (<><dt>Traits</dt><dd>{card.traits.join(", ")}</dd></>) : null}
            </dl>
          )}
          <div style={{ marginTop: 12 }}>
            <Link to="/navatar/card" className="btn btn-primary">Edit Card</Link>
          </div>
        </aside>
      </div>
    </main>
  );
}
