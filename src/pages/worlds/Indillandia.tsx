import React from "react";
import CharacterGrid from "../../components/CharacterGrid";
import { IndillandiaChars } from "../../content/characters";

export default function Indillandia() {
  return (
    <div className="world-page">
      <figure className="world-hero">
        <img
          src="/kingdoms/Indillandia/Inlandiamap.png"
          alt="Indillandia map"
          onError={(e) => ((e.currentTarget.src = "/placeholders/world-map.svg"))}
          loading="eager"
        />
        <figcaption className="sr-only">Indillandia map</figcaption>
      </figure>

      <h1>🌍 Indillandia</h1>
      <p className="muted">
        Welcome to Indillandia — explore traditions, landmarks, and celebrations.
      </p>

      <section className="world-section">
        <h2>Gallery</h2>
        <div className="coming-soon">Coming soon</div>
      </section>

      <section className="world-section">
        <h2>Characters</h2>
        <CharacterGrid items={IndillandiaChars} basePath="/kingdoms/Indillandia" />
      </section>
    </div>
  );
}

