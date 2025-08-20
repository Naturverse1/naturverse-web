import React from "react";
import { Link } from "react-router-dom";

export type HubCard = {
  to: string;
  title: string;
  description?: string;
  emoji?: string;
};

export default function HubGrid({ items }: { items: HubCard[] }) {
  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 16px" }}>
      <div
        style={{
          display: "grid",
          gap: 16,
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
        }}
      >
        {items.map((it) => (
          <Link
            key={it.to}
            to={it.to}
            style={{
              textDecoration: "none",
              border: "1px solid #e5e7eb",
              borderRadius: 12,
              padding: 16,
              background: "#fff",
            }}
          >
            <div style={{ fontSize: 28 }}>{it.emoji}</div>
            <h3 style={{ margin: "8px 0", color: "#111827" }}>{it.title}</h3>
            {it.description ? (
              <p style={{ margin: 0, color: "#4b5563" }}>{it.description}</p>
            ) : null}
          </Link>
        ))}
      </div>
    </div>
  );
}
