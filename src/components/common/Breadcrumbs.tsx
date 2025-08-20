import React from "react";
import { Link } from "react-router-dom";

type Crumb = { to?: string; label: string };

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav style={{ maxWidth: 1200, margin: "0 auto", padding: "0 16px 8px" }}>
      <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", gap: 8, flexWrap: "wrap" }}>
        {items.map((c, idx) => (
          <li key={idx} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {idx > 0 ? <span style={{ opacity: 0.6 }}>/</span> : null}
            {c.to ? (
              <Link to={c.to} style={{ color: "#2563eb", textDecoration: "none" }}>
                {c.label}
              </Link>
            ) : (
              <span style={{ color: "#111827" }}>{c.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
