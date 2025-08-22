import React from "react";
import CharacterGrid from "../../components/CharacterGrid";
import { ChilandiaChars } from "../../content/characters";

export default function Chilandia() {
  return (
    <div className="world-page">
      <figure className="world-hero">
        <img
          src="/kingdoms/Chilandia/Chilandiamap.jpg"
          alt="Chilandia map"
          onError={(e) => ((e.currentTarget.src = "/placeholders/world-map.svg"))}
          loading="eager"
        />
        <figcaption className="sr-only">Chilandia map</figcaption>
      </figure>

      <h1>🌍 Chilandia</h1>
      <p className="muted">
        Welcome to Chilandia — explore traditions, landmarks, and celebrations.
      </p>

      <section className="world-section">
        <h2>Gallery</h2>
        <div className="coming-soon">Coming soon</div>
      </section>

      <section className="world-section">
        <h2>Characters</h2>
        <CharacterGrid items={ChilandiaChars} basePath="/kingdoms/Chilandia" />
      </section>
    </div>
  );
}
