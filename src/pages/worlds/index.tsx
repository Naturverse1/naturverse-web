import React from "react";
import { WORLDS } from "../../data/worlds";

export default function WorldsIndex() {
  return (
    <div className="page-wrap">
      <h1>Worlds</h1>
      <p className="muted">Choose a kingdom to explore.</p>
      <div className="cards">
        {WORLDS.map(w => (
          <a className="card" key={w.slug} href={`/worlds/${w.slug}`}>
            <img src={w.map} alt={`${w.name} map`} loading="lazy" />
            <h2>{w.name}</h2>
            <p>{w.blurb}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
