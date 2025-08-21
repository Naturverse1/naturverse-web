import React from "react";
import { createRoot } from "react-dom/client";

// Global styles (fonts, layout, link colors, cards, etc.)
import "./styles.css";

// Prefer using the project's existing App if present.
// If not present, fall back to a minimal shell so the page renders.
let App: React.ComponentType;
try {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  App = (await import("./App")).default;
} catch {
  App = () => (
    <main className="container">
      <h1>Welcome 🌿</h1>
      <p>If you’re seeing this fallback, create <code>src/App.tsx</code>.</p>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
