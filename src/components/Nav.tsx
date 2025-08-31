import React from "react";
import { Link } from "react-router-dom";
import Icon from "./Icon";
import SearchBar from "./SearchBar";

export default function Nav() {
  return (
    <nav className="nv-nav">
      <Link to="/" className="nv-nav-item">
        <Icon name="home" size={18} /> Home
      </Link>
      <Link to="/worlds" className="nv-nav-item">
        <Icon name="world" size={18} /> Worlds
      </Link>
      <Link to="/marketplace" className="nv-nav-item">
        <Icon name="market" size={18} /> Marketplace
      </Link>
      <a href="/contact" className="nv-nav-item">
        <Icon name="contact" size={18} /> Contact
      </a>
      <div style={{ marginLeft: "auto", minWidth: 280 }}>
        <SearchBar />
      </div>
      <button className="nv-nav-menu" aria-label="Open menu">
        <Icon name="menu" size={20} />
      </button>
    </nav>
  );
}
