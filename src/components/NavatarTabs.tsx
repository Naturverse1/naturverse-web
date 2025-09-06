import { NavLink } from "react-router-dom";
import "./navatarTabs.css";

const TABS = [
  { to: "/navatar", label: "My Navatar" },
  { to: "/navatar/pick", label: "Pick" },
  { to: "/navatar/upload", label: "Upload" },
  { to: "/navatar/generate", label: "Generate" },
  { to: "/navatar/mint", label: "NFT / Mint" },
  { to: "/navatar/marketplace", label: "Marketplace" },
];

export default function NavatarTabs() {
  return (
    <div className="nv-tabs">
      {TABS.map(t => (
        <NavLink key={t.to} to={t.to} className={({isActive}) =>
          "nv-pill" + (isActive ? " is-active" : "")
        }>
          {t.label}
        </NavLink>
      ))}
    </div>
  );
}
