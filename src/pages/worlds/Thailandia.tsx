import React from "react";
import CharacterGrid from "../../components/CharacterGrid";
import { ThailandiaChars } from "../../content/characters";

export default function Thailandia() {
  return (
    <div className="world-page">
      <figure className="world-hero">
        <img
          src="/kingdoms/Thailandia/Thailandiamap.jpg"
          alt="Thailandia map"
          onError={(e) => ((e.currentTarget.src = "/placeholders/world-map.svg"))}
          loading="eager"
        />
        <figcaption className="sr-only">Thailandia map</figcaption>
      </figure>

      <h1>🌍 Thailandia</h1>
      <p className="muted">
        Welcome to Thailandia — explore traditions, landmarks, and celebrations.
      </p>

      <section className="world-section">
        <h2>Gallery</h2>
        <div className="coming-soon">Coming soon</div>
      </section>

      <section className="world-section">
        <h2>Characters</h2>
        <CharacterGrid items={ThailandiaChars} basePath="/kingdoms/Thailandia" />
      </section>
    </div>
  );
}
