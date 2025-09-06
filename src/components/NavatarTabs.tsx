import { Link } from "react-router-dom";

type Tab = "home" | "pick" | "upload" | "generate" | "mint" | "market";

export default function NavatarTabs({ active }: { active: Tab }) {
  const pill = (to: string, label: string, key: Tab) => (
    <Link
      key={key}
      to={to}
      className={`pill ${active === key ? "pill--active" : ""}`}
      aria-current={active === key ? "page" : undefined}
    >
      {label}
    </Link>
  );

  return (
    <nav className="navatar-tabs" role="tablist" aria-label="Navatar sections">
      {pill("/navatar", "My Navatar", "home")}
      {pill("/navatar/pick", "Pick", "pick")}
      {pill("/navatar/upload", "Upload", "upload")}
      {pill("/navatar/generate", "Generate", "generate")}
      {pill("/navatar/mint", "NFT / Mint", "mint")}
      {pill("/navatar/marketplace", "Marketplace", "market")}
    </nav>
  );
}

