import React from "react";
import WorldGallery from "../../components/worlds/WorldGallery";
import { WORLDS } from "../../content/worlds";

export default function AmerilandiaWorld() {
  const w = WORLDS.Amerilandia;
  return (
    <div className="world-page">
      <h1>🌏 Amerilandia</h1>
      <p className="muted">Welcome to Amerilandia — explore traditions, landmarks, and celebrations.</p>
      <WorldGallery mapSrc={w.mapSrc} alt={w.alt} characters={w.characters} />
    </div>
  );
}
