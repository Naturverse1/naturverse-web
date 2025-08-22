import React from "react";
import WorldGallery from "../../components/worlds/WorldGallery";
import { WORLDS } from "../../content/worlds";

export default function ChilandiaWorld() {
  const w = WORLDS.Chilandia;
  return (
    <div className="world-page">
      <h1>🌏 Chilandia</h1>
      <p className="muted">Welcome to Chilandia — explore traditions, landmarks, and celebrations.</p>
      <WorldGallery mapSrc={w.mapSrc} alt={w.alt} characters={w.characters} />
    </div>
  );
}
