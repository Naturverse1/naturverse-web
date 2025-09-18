import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import NavatarCard from "../../components/NavatarCard";
import BackToMyNavatar from "../../components/BackToMyNavatar";
import NavatarTabs from "../../components/NavatarTabs";
import { getCardForNavatar, navatarImageUrl, getMyNavatar } from "../../lib/navatar";
import type { NavatarCard as NavatarCardData, NavatarRow } from "../../lib/navatar";
import "../../styles/navatar.css";

export default function MintNavatarPage() {
  const [navatar, setNavatar] = useState<NavatarRow | null>(null);
  const [card, setCard] = useState<NavatarCardData | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const row = await getMyNavatar();
        if (!alive) return;
        setNavatar(row || null);
        if (row?.id) {
          const cardData = await getCardForNavatar(row.id);
          if (alive) setCard(cardData ?? null);
        } else if (alive) {
          setCard(null);
        }
      } catch {
        if (alive) {
          setNavatar(null);
          setCard(null);
        }
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <main className="page-pad mx-auto max-w-4xl p-4">
      <div className="bcRow">
        <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/navatar", label: "Navatar" }, { label: "NFT / Mint" }]} />
      </div>
      <h1 className="pageTitle mt-6 mb-12">NFT / Mint</h1>
      <BackToMyNavatar />
      <NavatarTabs context="subpage" />
      <p style={{ textAlign: "center", maxWidth: 560, margin: "8px auto 20px" }}>
        Coming soon: mint your Navatar on-chain. In the meantime, make merch with your Navatar on the Marketplace.
      </p>
      <div style={{ display: "grid", justifyItems: "center", gap: 12 }}>
        <NavatarCard src={navatarImageUrl(navatar?.image_path ?? null)} title={navatar?.name || "My Navatar"} />
        <a className="pill" href="/marketplace">Go to Marketplace</a>
      </div>

      {card ? (
        <aside className="nv-panel" style={{ maxWidth: 480, margin: "20px auto 0" }}>
          <div className="nv-title">Character Card</div>
          <dl className="nv-list">
            <dt>Name</dt><dd>{card.name}</dd>
            <dt>Species</dt><dd>{card.species}</dd>
            <dt>Kingdom</dt><dd>{card.kingdom}</dd>
            <dt>Backstory</dt><dd>{card.backstory || "—"}</dd>
            <dt>Powers</dt><dd>{card.powers?.map((p: string) => `— ${p}`).join("\n") || "—"}</dd>
            <dt>Traits</dt><dd>{card.traits?.map((t: string) => `— ${t}`).join("\n") || "—"}</dd>
          </dl>
          <div style={{ marginTop: 12, textAlign: "center" }}>
            <Link to="/navatar/card" className="btn">Edit Card</Link>
          </div>
        </aside>
      ) : (
        <div className="nv-panel" style={{ maxWidth: 480, margin: "20px auto 0" }}>
          <div className="nv-title">Character Card</div>
          <p>No card yet. <Link to="/navatar/card">Create Card</Link></p>
        </div>
      )}
    </main>
  );
}

