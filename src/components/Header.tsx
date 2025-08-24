import React, { useMemo } from "react";

export default function Header() {
  const path = typeof window !== "undefined" ? window.location.pathname : "/";
  const isActive = useMemo(
    () => (href: string) => path === href || (href !== "/" && path.startsWith(href)),
    [path]
  );

  return (
    <header>
      <nav className="topnav" style={{display:"flex",gap:12,flexWrap:"wrap"}}>
        <a href="/" className={isActive("/") ? "active" : ""}>Home</a>
        <a href="/worlds" className={isActive("/worlds") ? "active" : ""}>Worlds</a>
        <a href="/zones" className={isActive("/zones") ? "active" : ""}>Zones</a>
        <a href="/marketplace" className={isActive("/marketplace") ? "active" : ""}>Marketplace</a>
        <a href="/naturversity" className={isActive("/naturversity") ? "active" : ""}>Naturversity</a>
        <a href="/navatar" className={isActive("/navatar") ? "active" : ""}>Navatar</a>
        <a href="/passport" className={isActive("/passport") ? "active" : ""}>Passport</a>
        <a href="/naturbank" className={isActive("/naturbank") ? "active" : ""}>NaturBank</a>
        <a href="/turian" className={isActive("/turian") ? "active" : ""}>Turian</a>
        <a href="/profile" className={isActive("/profile") ? "active" : ""}>Profile</a>
      </nav>
    </header>
  );
}
