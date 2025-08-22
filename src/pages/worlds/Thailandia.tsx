import React from "react";

export default function Thailandia() {
  const mapSrc = "/kingdoms/Thailandia/Thailandiamap.png"; // exact filename in /public/kingdoms/Thailandia/
  return (
    <div className="world-page">
      <figure className="world-hero">
        <img src={mapSrc} alt="Thailandia map" loading="eager" />
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
        <div className="coming-soon">Coming soon</div>
      </section>
    </div>
  );
}
