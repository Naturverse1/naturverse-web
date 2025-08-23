import React from "react";

export default function NotFound() {
  return (
    <div style={{ maxWidth: 820, margin: "30px auto" }}>
      <h1>404 — Page not found</h1>
      <p className="muted">That path doesn’t exist. It might have moved or been renamed.</p>
      <div className="row" style={{ marginTop: 12 }}>
        <a className="btn" href="/">← Back to Home</a>
        <a className="btn outline" href="/worlds">Explore Worlds</a>
        <a className="btn outline" href="/zones">Explore Zones</a>
      </div>
    </div>
  );
}
