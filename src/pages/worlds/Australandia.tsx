import React from "react";
import WorldGallery from "../../components/worlds/WorldGallery";
import { WORLDS } from "../../content/worlds";

export default function AustralandiaWorld() {
  const w = WORLDS.Australandia;
  return (
    <div className="world-page">
      <h1>🌏 Australandia</h1>
      <p className="muted">Welcome to Australandia — explore traditions, landmarks, and celebrations.</p>
      <WorldGallery mapSrc={w.mapSrc} alt={w.alt} characters={w.characters} />
    </div>
  );
}
