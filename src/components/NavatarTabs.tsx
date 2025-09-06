import React from "react";
import { Link } from "react-router-dom";

type TabKey =
  | "my"
  | "pick"
  | "upload"
  | "generate"
  | "mint"
  | "marketplace";

const TABS: { to: string; label: string; key: TabKey }[] = [
  { to: "/navatar", label: "My Navatar", key: "my" },
  { to: "/navatar/pick", label: "Pick", key: "pick" },
  { to: "/navatar/upload", label: "Upload", key: "upload" },
  { to: "/navatar/generate", label: "Generate", key: "generate" },
  { to: "/navatar/mint", label: "NFT / Mint", key: "mint" },
  { to: "/navatar/marketplace", label: "Marketplace", key: "marketplace" },
];

interface Props {
  active: TabKey;
  variant?: "home" | "sub";
}

export default function NavatarTabs({ active, variant = "home" }: Props) {
  return (
    <nav
      className={["nv-tabs", variant === "sub" ? "nv-tabs--sub" : ""].join(" ")}
      aria-label="Navatar tabs"
    >
      {TABS.map((t) => (
        <Link key={t.to} to={t.to} className={`pill ${active === t.key ? "pill--active" : ""}`}>
          {t.label}
        </Link>
      ))}
    </nav>
  );
}
