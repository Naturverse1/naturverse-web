import React, { useEffect, useState } from "react";
import NavatarTabs from "../../components/NavatarTabs";
import { fetchActiveNavatar, fetchMyCharacterCard } from "../../lib/navatar";

export default function MintPage() {
  const [avatar, setAvatar] = useState<any | null>(null);
  const [card, setCard] = useState<any | null>(null);

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
  }, []);

  return (
    <main className="container page-pad">
      <h1 className="center page-title">NFT / Mint</h1>
      <NavatarTabs />

      <p className="center" style={{ opacity: 0.8 }}>
        Coming soon: mint your Navatar on-chain. In the meantime, make merch with
        your Navatar on the Marketplace.
      </p>

      {avatar && (
        <figure className="nav-card" style={{ margin: "16px auto" }}>
          <div className="nav-card__img" aria-label="Navatar">
            <img src={avatar.image_url || ""} alt={avatar.name || "Navatar"} />
          </div>
          <figcaption className="nav-card__cap">
            <strong>{avatar.name || "My Navatar"}</strong>
          </figcaption>
        </figure>
      )}

      <div className="nv-panel" style={{ margin: "16px auto", maxWidth: 640 }}>
        <div className="nv-title">Character Card</div>
        {!card ? (
          <p>No card yet. <a href="/navatar/card">Create Card</a></p>
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
      </div>
    </main>
  );
}
