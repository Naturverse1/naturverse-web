import React from "react";

export default function ThailandiaWorld() {
  return (
    <div className="world-page">
      <h1>🌏 Thailandia</h1>
      <p className="muted">
        Welcome to Thailandia — explore traditions, landmarks, and celebrations.
      </p>

      <div className="cards">
        <a className="card" href="/worlds/thailandia#landmarks">
          <img src="/assets/thailandia/temple.png" alt="Thai Temple" />
          <h2>Landmarks</h2>
          <p>Iconic temples, rivers, and floating markets.</p>
        </a>

        <a className="card" href="/worlds/thailandia#festivals">
          <img src="/assets/thailandia/festival.jpg" alt="Festival" />
          <h2>Festivals</h2>
          <p>Songkran, Loy Krathong, and seasonal holidays.</p>
        </a>

        <a className="card" href="/worlds/thailandia#culture">
          <img src="/assets/thailandia/flag.png" alt="Flag of Thailandia" />
          <h2>Culture</h2>
          <p>Food, music, and traditions unique to Thailandia.</p>
        </a>
      </div>
    </div>
  );
}

