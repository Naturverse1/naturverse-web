import React from "react";
import { NavLink } from "react-router-dom";
import "./../styles/navatar.css";

const tabs = [
  { to: "/navatar", label: "My Navatar" },
  { to: "/navatar/pick", label: "Pick" },
  { to: "/navatar/upload", label: "Upload" },
  { to: "/navatar/generate", label: "Generate" },
  { to: "/navatar/mint", label: "NFT / Mint" },
  { to: "/marketplace", label: "Marketplace" },
];

export default function NavatarTabs() {
  return (
    <div className="nv-tabs" role="tablist">
      {tabs.map(t => (
        <NavLink
          key={t.to}
          className={({isActive}) => "pill" + (isActive ? " active" : "")}
          to={t.to}
          end
        >
          {t.label}
        </NavLink>
      ))}
    </div>
  );
}
