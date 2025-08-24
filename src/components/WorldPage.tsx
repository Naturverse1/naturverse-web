import React from "react";
import Img from "./Img";

type Props = {
  title: string;
  intro: string;
  mapSrc: string; // absolute path in /public
};

export default function WorldPage({ title, intro, mapSrc }: Props) {
  const fallback = "/placeholders/world-map.svg";

  return (
    <div className="world-page">
      <figure className="world-hero-wrap">
        <Img
          src={mapSrc}
          alt={`${title} map`}
          className="world-hero"
          onError={(e) => ((e.currentTarget.src = fallback))}        />
        <figcaption className="sr-only">{title} map</figcaption>
      </figure>

      <h1>🌍 {title}</h1>
      <p className="muted">{intro}</p>

      <section className="world-section">
        <h2>Gallery</h2>
        <div className="coming-soon">Coming soon</div>
      </section>

      <section className="world-section">
        <h2>Characters</h2>
        <div className="coming-soon">Coming soon</div>
      </section>
    </div>
  );
}

