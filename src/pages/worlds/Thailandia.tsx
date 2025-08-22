import React from "react";
import WorldGallery from "../../components/worlds/WorldGallery";
import { WORLDS } from "../../content/worlds";

export default function ThailandiaWorld() {
  const w = WORLDS.Thailandia;
  return (
    <div className="world-page">
      <h1>🌏 Thailandia</h1>
      <p className="muted">Welcome to Thailandia — explore traditions, landmarks, and celebrations.</p>
      <WorldGallery mapSrc={w.mapSrc} alt={w.alt} characters={w.characters} />
    </div>
  );
}
