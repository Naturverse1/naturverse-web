import { Link } from "react-router-dom";

export type Tab =
  | "navatar"
  | "card"
  | "pick"
  | "upload"
  | "generate"
  | "mint"
  | "marketplace";

const TABS: { to: string; label: string; key: Tab }[] = [
  { to: "/navatar", label: "My Navatar", key: "navatar" },
  { to: "/navatar/card", label: "Card", key: "card" },
  { to: "/navatar/pick", label: "Pick", key: "pick" },
  { to: "/navatar/upload", label: "Upload", key: "upload" },
  { to: "/navatar/generate", label: "Generate", key: "generate" },
  { to: "/navatar/mint", label: "NFT / Mint", key: "mint" },
  { to: "/navatar/marketplace", label: "Marketplace", key: "marketplace" },
];

export default function NavatarPills({ active, color = "blue" }: { active: Tab; color?: "blue" | "gray" }) {
  const activeStyle =
    color === "blue"
      ? { background: "var(--nv-blue-800)", color: "#fff", borderColor: "var(--nv-blue-800)" }
      : { background: "#111827", color: "#fff", borderColor: "#111827" };
  const idleStyle =
    color === "blue"
      ? {
          background: "#fff",
          color: "var(--nv-blue-800)",
          border: "1px solid var(--nv-blue-200)",
        }
      : {
          background: "#fff",
          color: "#111827",
          border: "1px solid #e5e7eb",
        };
  return (
    <nav className="nav-tabs" aria-label="Navatar actions">
      {TABS.map(t => (
        <Link key={t.to} to={t.to} className="pill" style={t.key === active ? activeStyle : idleStyle}>
          {t.label}
        </Link>
      ))}
    </nav>
  );
}
