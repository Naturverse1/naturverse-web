import React from "react";
import { ZONES } from "../../data/zones";

export default function Zones() {
  return (
    <div>
      <h1>Zones</h1>
      <div className="cards grid-gap">
        {ZONES.map((z) => (
          <a key={z.href} className="card" href={z.href}>
            <h2>{z.title}</h2>
            <p>{z.blurb}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
