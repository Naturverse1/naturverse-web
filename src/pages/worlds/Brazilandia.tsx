import React from "react";
import CharacterGrid from "../../components/CharacterGrid";
import { BrazilandiaChars } from "../../content/characters";

export default function Brazilandia() {
  return (
    <div className="world-page">
      <figure className="world-hero">
        <img
          src="/kingdoms/Brazilandia/Brazilandiamap.png"
          alt="Brazilandia map"
          onError={(e) => ((e.currentTarget.src = "/placeholders/world-map.svg"))}
          loading="eager"
        />
        <figcaption className="sr-only">Brazilandia map</figcaption>
      </figure>

      <h1>🌍 Brazilandia</h1>
      <p className="muted">
        Welcome to Brazilandia — explore traditions, landmarks, and celebrations.
      </p>

      <section className="world-section">
        <h2>Gallery</h2>
        <div className="coming-soon">Coming soon</div>
      </section>

      <section className="world-section">
        <h2>Characters</h2>
        <CharacterGrid items={BrazilandiaChars} basePath="/kingdoms/Brazilandia" />
      </section>
    </div>
  );
}
