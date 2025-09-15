import { useEffect, useState } from "react";
import Breadcrumbs from "../../components/Breadcrumbs";
import NavatarTabs from "../../components/NavatarTabs";
import NavatarCard from "../../components/NavatarCard";
import { getMyAvatar, getMyCharacterCard } from "../../lib/navatar";
import type { CharacterCard } from "../../lib/navatar";
import { useAuthUser } from "../../lib/useAuthUser";
import { Link } from "react-router-dom";
import "../../styles/navatar.css";

export default function MyNavatarPage() {
  const [avatar, setAvatar] = useState<any | null>(null);
  const [card, setCard] = useState<CharacterCard | null>(null);
  const { user } = useAuthUser();

  useEffect(() => {
    if (!user) return;
    let alive = true;
    (async () => {
      try {
        const my = await getMyAvatar();
        if (alive) setAvatar(my);
        const c = await getMyCharacterCard();
        if (alive) setCard(c);
      } catch {
        // ignore
      }
    })();
    return () => {
      alive = false;
    };
  }, [user?.id]);

  return (
    <main className="page-pad mx-auto max-w-4xl p-4">
      <div className="bcRow">
        <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/navatar", label: "Navatar" }]} />
      </div>
      <h1 className="pageTitle mt-6 mb-12">My Navatar</h1>
      <NavatarTabs context="hub" />
      <div className="nv-hub-grid mt-6">
        <section>
          <div className="nv-panel">
            <NavatarCard src={avatar?.image_url || undefined} title={avatar?.name || "Turian"} />
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
