import React from "react";
import { Link, NavLink, Outlet } from "react-router-dom";

const tabs = [
  ["Worlds", "/worlds"],
  ["Zones", "/zones"],
  ["Marketplace", "/marketplace"],
  ["Naturversity", "/naturversity"],
  ["Naturbank", "/naturbank"],
  ["Navatar", "/navatar"],
  ["Passport", "/passport"],
  ["Turian", "/turian"],
  ["Profile", "/profile"],
] as const;

export default function AppShell() {
  return (
    <div className="wrap">
      <header className="top">
        <Link to="/" className="brand">Naturverse <span>🌿</span></Link>
        <nav className="tabs">
          {tabs.map(([label, to]) => (
            <NavLink key={to} to={to} className={({isActive}) => isActive ? "tab active" : "tab"}>
              {label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="main"><Outlet/></main>
      <footer className="foot">© {new Date().getFullYear()} Naturverse</footer>
    </div>
  );
}
