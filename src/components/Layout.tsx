import { Link, NavLink } from "react-router-dom";
import React from "react";

const nav = [
  ["Home", "/"],
  ["Worlds", "/worlds"],
  ["Zones", "/zones"],
  ["Marketplace", "/marketplace"],
  ["Naturversity", "/naturversity"],
  ["Naturbank", "/naturbank"],
  ["Navatar", "/navatar"],
  ["Passport", "/passport"],
  ["Turian", "/turian"],
  ["Profile", "/profile"]
];

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container">
      <header className="site-header">
        <Link to="/" className="brand">
          <span>Welcome</span> <span className="leaf" aria-hidden>🌿</span>
        </Link>
        <nav className="top-nav">
          {nav.map(([label, to]) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
              end={to === "/"}
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="content">{children}</main>
      <footer className="site-footer">© 2025 Naturverse</footer>
    </div>
  );
}
