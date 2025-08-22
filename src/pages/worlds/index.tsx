import React from "react";

export default function WorldsIndex() {
  return (
    <div className="world-page">
      <h1>Worlds</h1>
      <div className="cards">
        <a className="card" href="/worlds/thailandia">
          <img src="/assets/thailandia/flag.png" alt="Thailandia" />
          <h2>Thailandia</h2>
          <p>Coconuts, elephants, festivals, and more.</p>
        </a>
      </div>
    </div>
  );
}

