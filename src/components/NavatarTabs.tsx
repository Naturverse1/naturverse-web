import { Link, useLocation } from "react-router-dom";

export type TabKey =
  | "navatar"
  | "card"
  | "pick"
  | "upload"
  | "generate"
  | "mint"
  | "marketplace";

const TABS: { to: string; label: string; key: TabKey }[] = [
  { to: "/navatar", label: "My Navatar", key: "navatar" },
  { to: "/navatar/card", label: "Card", key: "card" },
  { to: "/navatar/pick", label: "Pick", key: "pick" },
  { to: "/navatar/upload", label: "Upload", key: "upload" },
  { to: "/navatar/generate", label: "Generate", key: "generate" },
  { to: "/navatar/mint", label: "NFT / Mint", key: "mint" },
  { to: "/navatar/marketplace", label: "Marketplace", key: "marketplace" },
];

export default function NavatarTabs() {
  const { pathname } = useLocation();
  return (
    <nav className="nav-tabs" aria-label="Navatar actions">
      {TABS.map(t => {
        const active = pathname === t.to;
        return (
          <Link
            key={t.to}
            to={t.to}
            className={"pill" + (active ? " pill--active" : "")}
          >
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}

