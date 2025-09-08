import React from "react";
import { Link, useLocation } from "react-router-dom";

const items = [
  { to: "/navatar", label: "My Navatar" },
  { to: "/navatar/card", label: "Card" },
  { to: "/navatar/pick", label: "Pick" },
  { to: "/navatar/upload", label: "Upload" },
  { to: "/navatar/generate", label: "Generate" },
  { to: "/navatar/mint", label: "NFT / Mint" },
  { to: "/marketplace", label: "Marketplace" },
];

export default function NavatarTabs() {
  const { pathname } = useLocation();
  return (
    <nav className="nv-tabs">
      {items.map((it) => {
        const active = pathname === it.to;
        return (
          <Link
            key={it.to}
            to={it.to}
            className={`pill ${active ? "pill--active" : ""}`}
          >
            {it.label}
          </Link>
        );
      })}
    </nav>
  );
}
