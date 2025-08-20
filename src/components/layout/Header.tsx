import React from "react";
import { Link, NavLink } from "react-router-dom";

const linkStyle: React.CSSProperties = { textDecoration: "none", color: "#111827", padding: "8px 12px", borderRadius: 8 };
const activeStyle: React.CSSProperties = { background: "#eef2ff", color: "#3730a3" };

export default function Header() {
  return (
    <header style={{ borderBottom: "1px solid #e5e7eb", background: "#fff" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "12px 16px", display: "flex", alignItems: "center", gap: 16 }}>
        <Link to="/" style={{ ...linkStyle, fontWeight: 700 }}>Naturverse</Link>
        <nav style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <NavLink to="/worlds" style={({ isActive }) => ({ ...linkStyle, ...(isActive ? activeStyle : {}) })}>Worlds</NavLink>
          <NavLink to="/zones" style={({ isActive }) => ({ ...linkStyle, ...(isActive ? activeStyle : {}) })}>Zones</NavLink>
          <NavLink to="/marketplace" style={({ isActive }) => ({ ...linkStyle, ...(isActive ? activeStyle : {}) })}>Marketplace</NavLink>
          <NavLink to="/naturversity" style={({ isActive }) => ({ ...linkStyle, ...(isActive ? activeStyle : {}) })}>Naturversity</NavLink>
          <NavLink to="/naturbank" style={({ isActive }) => ({ ...linkStyle, ...(isActive ? activeStyle : {}) })}>Naturbank</NavLink>
          <NavLink to="/navatar" style={({ isActive }) => ({ ...linkStyle, ...(isActive ? activeStyle : {}) })}>Navatar</NavLink>
          <NavLink to="/profile" style={({ isActive }) => ({ ...linkStyle, ...(isActive ? activeStyle : {}) })}>Profile</NavLink>
        </nav>
      </div>
    </header>
  );
}
