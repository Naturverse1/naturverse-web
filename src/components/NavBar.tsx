import { Link, NavLink } from "react-router-dom";
import "./NavBar.css";

export default function NavBar() {
  return (
    <div className="nv-bar">
      <Link to="/" className="nv-brand" style={{ display:"flex", alignItems:"center", gap:8 }}>
        <img src="/assets/turian-mark.png" alt="Naturverse logo" width={22} height={22} onError={(e)=>{(e.target as HTMLImageElement).style.display='none'}}/>
        <span>Naturverse</span>
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
  );
}
