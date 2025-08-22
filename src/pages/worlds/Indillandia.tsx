import React from "react";
import WorldGallery from "../../components/worlds/WorldGallery";
import { WORLDS } from "../../content/worlds";

export default function IndillandiaWorld() {
  const w = WORLDS.Indillandia;
  return (
    <div className="world-page">
      <h1>🌏 Indillandia</h1>
      <p className="muted">Welcome to Indillandia — explore traditions, landmarks, and celebrations.</p>
      <WorldGallery mapSrc={w.mapSrc} alt={w.alt} characters={w.characters} />
    </div>
  );
}
