import React from "react";
import { WORLDS } from "../../data/worlds";

export default function WorldsIndex() {
  return (
    <div>
      <h1>Worlds</h1>
      <p>Explore the 14 kingdoms.</p>
      <div className="cards">
        {WORLDS.map(({ id, name, tagline }) => (
          <a key={id} className="card" href={`/worlds/${id}`}>
            <h2>{name}</h2>
            <p>{tagline}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
