import React from "react";
import TurianTips from "../components/TurianTips";

export default function TipsPage() {
  return (
    <main style={{ maxWidth: 820, margin: "2rem auto", padding: "0 1rem" }}>
      <h2>🧠 Turian Tips</h2>
      <p>Quick, actionable ideas to explore the Naturverse.</p>
      <TurianTips />
    </main>
  );
}

