import React, { useEffect } from "react";

export default function NotFound() {
  useEffect(() => {
    document.title = "Naturverse — Page not found";
    const m = document.querySelector('meta[name="description"]');
    if (m) m.setAttribute("content", "This page could not be found.");
  }, []);

  return (
    <div id="main" className="page" style={{ maxWidth: 900, margin: "24px auto" }}>
      <h1>404 — Not found</h1>
      <p className="muted">Looks like this trail doesn’t exist yet.</p>
      <a className="btn" href="/">← Back to Home</a>
    </div>
  );
}

