import React from "react";
import CharacterGrid from "../../components/CharacterGrid";
import { AmerilandiaChars } from "../../content/characters";

export default function Amerilandia() {
  return (
    <div className="world-page">
      <figure className="world-hero">
        <img
          src="/kingdoms/Amerilandia/Amerilaniamap.png"
          alt="Amerilandia map"
          onError={(e) => ((e.currentTarget.src = "/placeholders/world-map.svg"))}
          loading="eager"
        />
        <figcaption className="sr-only">Amerilandia map</figcaption>
      </figure>

      <h1>🌍 Amerilandia</h1>
      <p className="muted">
        Welcome to Amerilandia — explore traditions, landmarks, and celebrations.
      </p>

      <section className="world-section">
        <h2>Gallery</h2>
        <div className="coming-soon">Coming soon</div>
      </section>

      <section className="world-section">
        <h2>Characters</h2>
        <CharacterGrid items={AmerilandiaChars} basePath="/kingdoms/Amerilandia" />
      </section>
    </div>
  );
}
