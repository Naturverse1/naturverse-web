import React from "react";
import { NavLink } from "react-router-dom";

export default function NavatarTabs() {
  return (
    <nav className="tabs">
      <NavLink to="/navatar" className="pill">My Navatar</NavLink>
      <NavLink to="/navatar/card" className="pill">Card</NavLink>
      <NavLink to="/navatar/pick" className="pill">Pick</NavLink>
      <NavLink to="/navatar/upload" className="pill">Upload</NavLink>
      <NavLink to="/navatar/generate" className="pill">Generate</NavLink>
      <NavLink to="/navatar/mint" className="pill">NFT / Mint</NavLink>
      <NavLink to="/navatar/marketplace" className="pill">Marketplace</NavLink>
    </nav>
  );
}
