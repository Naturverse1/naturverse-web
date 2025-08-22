import React from "react";
import CharacterGrid from "../../components/CharacterGrid";
import { AustralandiaChars } from "../../content/characters";

export default function Australandia() {
  return (
    <div className="world-page">
      <figure className="world-hero">
        <img
          src="/kingdoms/Australandia/Australaniamap.png"
          alt="Australandia map"
          onError={(e) => ((e.currentTarget.src = "/placeholders/world-map.svg"))}
          loading="eager"
        />
        <figcaption className="sr-only">Australandia map</figcaption>
      </figure>

      <h1>🌍 Australandia</h1>
      <p className="muted">
        Welcome to Australandia — explore traditions, landmarks, and celebrations.
      </p>

      <section className="world-section">
        <h2>Gallery</h2>
        <div className="coming-soon">Coming soon</div>
      </section>

      <section className="world-section">
        <h2>Characters</h2>
        <CharacterGrid items={AustralandiaChars} basePath="/kingdoms/Australandia" />
      </section>
    </div>
  );
}
