import React from "react";

export default function NotFound() {
  return (
    <div className="page notfound" style={{ padding: 24 }}>
      <h1>404 — Page not found</h1>
      <p className="muted">The page you’re looking for doesn’t exist.</p>
      <p><a className="btn" href="/">Back to Home</a></p>
    </div>
  );
}
