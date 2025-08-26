import React from "react";
import Breadcrumbs from "../../components/Breadcrumbs";

const items = [
  { id: "card-thai", title: "Navatar — Thailandia", blurb: "Coconuts & Elephants series" },
  { id: "card-kiwi", title: "Navatar — Kiwilandia", blurb: "Kiwis & Sheep series" },
  { id: "poster-reef", title: "Poster — ReefCare", blurb: "Coral restoration art" },
];

export default function NFTs() {
  return (
    <main id="naturbank">
      <div id="main" data-page="naturbank" className="nvrs-section naturbank page-wrap">
        <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/naturbank", label: "NaturBank" }, { label: "NFTs" }]} />
        <h1>🖼️ NFTs</h1>
        <p>Preview collectibles. Minting connects later.</p>
        <div className="hub-grid">
          {items.map(x => (
            <div key={x.id} className="hub-card">
              <div className="emoji">🎴</div>
              <div className="title">{x.title}</div>
              <div className="desc">{x.blurb}</div>
              <button className="btn tiny" disabled>Mint (soon)</button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
