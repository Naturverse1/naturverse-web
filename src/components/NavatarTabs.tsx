import React from "react";
import { Link, useLocation } from "react-router-dom";

const TABS = [
  { to: "/navatar", label: "My Navatar" },
  { to: "/navatar/pick", label: "Pick" },
  { to: "/navatar/upload", label: "Upload" },
  { to: "/navatar/generate", label: "Generate" },
  { to: "/navatar/mint", label: "NFT / Mint" },
  { to: "/navatar/marketplace", label: "Marketplace" },
];

export default function NavatarTabs() {
  const { pathname } = useLocation();
  return (
    <nav className="nav-tabs" aria-label="Navatar actions">
      {TABS.map(t => {
        const active =
          t.to === "/navatar" ? pathname === "/navatar" : pathname.startsWith(t.to);
        return (
          <Link key={t.to} to={t.to} className={`pill ${active ? "pill--active" : ""}`}>
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
