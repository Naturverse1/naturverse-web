import React from "react";

const WORLDS = [
  ["Thailandia", "/worlds/thailandia"],
  ["Brazilandia", "/worlds/brazilandia"],
  ["Chilandia", "/worlds/chilandia"],
  ["Indillandia", "/worlds/indillandia"],
  ["Amerilandia", "/worlds/amerilandia"],
  ["Australandia", "/worlds/australandia"],
  ["Japonica", "/worlds/japonica"],
  ["Africana", "/worlds/africana"],
  ["Europalia", "/worlds/europalia"],
  ["Britannula", "/worlds/britannula"],
  ["Kiwilandia", "/worlds/kiwilandia"],
  ["Madagascaria", "/worlds/madagascaria"],
  ["Greenlandia", "/worlds/greenlandia"],
  ["Antarctiland", "/worlds/antarctiland"],
];

export default function WorldsIndex() {
  return (
    <div>
      <h1>Worlds</h1>
      <p>Explore the 14 kingdoms.</p>
      <div className="cards">
        {WORLDS.map(([name, href]) => (
          <a key={name} className="card" href={href}>
            <h2>{name}</h2>
            <p>Open {name} →</p>
          </a>
        ))}
      </div>
    </div>
  );
}

