import React from "react";

export default function NotFound() {
  return (
    <div style={{maxWidth:1100,margin:"0 auto",padding:16}}>
      <h1>Page not found</h1>
      <p className="muted">That path doesn’t exist. Try the hubs below.</p>
      <div className="cards" style={{marginTop:12}}>
        <a className="card" href="/worlds"><h2>Worlds</h2><p>Explore the 14 kingdoms.</p></a>
        <a className="card" href="/zones"><h2>Zones</h2><p>Arcade, Music, Wellness, and more.</p></a>
        <a className="card" href="/marketplace"><h2>Marketplace</h2><p>Plushies, tees, stickers.</p></a>
        <a className="card" href="/naturversity"><h2>Naturversity</h2><p>Learn nature, culture, languages.</p></a>
      </div>
      <div style={{marginTop:16}}>
        <a className="btn" href="/">Back to Home</a>
      </div>
    </div>
  );
}
