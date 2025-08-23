import React from "react";

export default function NotFound() {
  return (
    <div className="page-wrap" style={{ paddingTop: 24 }}>
      <h1>Page not found</h1>
      <p className="muted">That path doesn’t exist. Try one of these hubs:</p>
      <div className="cards">
        <a className="card" href="/worlds"><h2>Worlds</h2><p>Explore all kingdoms.</p></a>
        <a className="card" href="/zones"><h2>Zones</h2><p>Arcade, Music, Wellness, and more.</p></a>
        <a className="card" href="/marketplace"><h2>Marketplace</h2><p>Shop, Wishlist, Checkout.</p></a>
        <a className="card" href="/naturversity"><h2>Naturversity</h2><p>Learn, courses, languages.</p></a>
      </div>
      <div style={{ marginTop: 16 }}>
        <a className="btn" href="/">Back to Home</a>
      </div>
    </div>
  );
}
