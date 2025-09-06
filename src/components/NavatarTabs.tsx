import React from "react";
import { Link, useLocation } from "react-router-dom";

const TAB = (to: string, label: string, here: string) => (
  <Link to={to} className={`nv-tab ${here === to ? "is-active" : ""}`}>{label}</Link>
);

export default function NavatarTabs() {
  const loc = useLocation();
  const here = loc.pathname;
  return (
    <div className="nv-tabs-wrap">
      <div className="nv-tabs">
        {TAB("/navatar", "My Navatar", here === "/navatar" ? "/navatar" : here)}
        {TAB("/navatar/pick", "Pick", here)}
        {TAB("/navatar/upload", "Upload", here)}
        {TAB("/navatar/generate", "Generate", here)}
      </div>

      <div className="nv-actions">
        <Link to="/navatar/mint" className="btn btn-outline">NFT / Mint</Link>
        <Link to="/marketplace" className="btn btn-primary">Marketplace</Link>
      </div>
    </div>
  );
}
