import { Link, NavLink } from "react-router-dom";
import "./Header.css";

export default function Header() {
  return (
    <header className="nv-header">
      <div className="nv-bar">
        <Link to="/" className="nv-brand">
          <img src="/assets/logo.svg" alt="Naturverse logo" className="nv-logo" />
        </Link>

        <input id="nv-menu-toggle" className="nv-menu-toggle" type="checkbox" aria-label="Toggle navigation" />
        <label htmlFor="nv-menu-toggle" className="nv-burger" aria-hidden="true">
          <span/><span/><span/>
        </label>

        <nav className="nv-nav">
          <NavLink to="/worlds">Worlds</NavLink>
          <NavLink to="/zones">Zones</NavLink>
          <NavLink to="/marketplace">Marketplace</NavLink>
          <NavLink to="/naturversity">Naturversity</NavLink>
          <NavLink to="/naturbank">Naturbank</NavLink>
          <NavLink to="/navatar">Navatar</NavLink>
          <NavLink to="/passport">Passport</NavLink>
          <NavLink to="/turian">Turian</NavLink>
          <NavLink to="/profile">Profile</NavLink>
          <NavLink to="/zones/culture">Culture</NavLink>
        </nav>
      </div>
    </header>
  );
}
