import React from 'react';
import { KINGDOMS, KingdomId } from '../data/kingdoms';
import { mapFor } from '../data/maps';
import '../styles/worlds.css';
import CharacterGrid from './CharacterGrid';

type Props = { id: KingdomId };

export default function WorldLayout({ id }: Props) {
  const k = KINGDOMS[id];

  return (
    <main id="main" className="world-wrap container-narrow world-page">
      <h1 className="world-title">{k.title}</h1>

      {/* Map hero */}
      <section className="world-hero-wrap card">
        <img src={mapFor(id)} alt={`${k.title} map`} className="world-hero" loading="eager" />
        <div className="hero-meta">
          <h2>World Map</h2>
          <p>Zoom into landmarks, routes, and regions.</p>
        </div>
      </section>

      {/* Characters grid */}
      <section className="world-section">
        <h2>Characters</h2>
        <CharacterGrid kingdom={k.title} />
      </section>
    </main>
  );
}
