import React from "react";
import WorldGallery from "../../components/worlds/WorldGallery";
import { WORLDS } from "../../content/worlds";

export default function BrazilandiaWorld() {
  const w = WORLDS.Brazilandia;
  return (
    <div className="world-page">
      <h1>🌏 Brazilandia</h1>
      <p className="muted">Welcome to Brazilandia — explore traditions, landmarks, and celebrations.</p>
      <WorldGallery mapSrc={w.mapSrc} alt={w.alt} characters={w.characters} />
    </div>
  );
}
