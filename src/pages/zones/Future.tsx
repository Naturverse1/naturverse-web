import React from "react";
import Breadcrumbs from "../../components/Breadcrumbs";

export default function FutureZone() {
  return (
      <div className="page-wrap zones-page zones-page2">
        <Breadcrumbs />
        <main id="main" className="page">

        <h1>🔮 Future Zone</h1>
      <p className="muted">
        A sneak peek at what's coming to the Naturverse. These features are in active design.
      </p>

      <div className="cards">
        <a className="card" href="#" aria-disabled="true">
          <div className="tag soon">Coming Soon</div>
          <h2>AR / VR</h2>
          <p>Immersive augmented & virtual reality adventures inside the Naturverse.</p>
        </a>

        <a className="card" href="#" aria-disabled="true">
          <div className="tag soon">Coming Soon</div>
          <h2>Console Play</h2>
          <p>Cross-platform gaming with console integration and family profiles.</p>
        </a>

        <a className="card" href="#" aria-disabled="true">
          <div className="tag soon">Coming Soon</div>
          <h2>Worldwide Multiplayer</h2>
          <p>Compete and collaborate across the globe in real-time events.</p>
        </a>

        <a className="card" href="#" aria-disabled="true">
          <div className="tag soon">Coming Soon</div>
          <h2>3D Worlds</h2>
          <p>Explore fully 3D kingdoms and environments with your Navatar.</p>
        </a>

        <a className="card" href="#" aria-disabled="true">
          <div className="tag soon">Coming Soon</div>
          <h2>AI Companions</h2>
          <p>Your Navatar learns, grows, and evolves with you across zones.</p>
        </a>

        <a className="card" href="#" aria-disabled="true">
          <div className="tag soon">Coming Soon</div>
          <h2>Marketplace Upgrades</h2>
          <p>NATUR wallet, trading, redemptions, and seasonal global events.</p>
        </a>
      </div>
        </main>
      </div>
    );
}

