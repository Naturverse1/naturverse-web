import React from "react";

export default function NotFound() {
  return (
    <div id="main" style={{ maxWidth: 760, margin: "40px auto", padding: 16 }}>
      <h1>Page not found</h1>
      <p className="muted">This path doesn’t exist in the Naturverse yet.</p>
      <a className="button" href="/">← Back to Home</a>
    </div>
  );
}
