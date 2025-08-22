import { NavLink } from "react-router-dom";

export default function NavBar() {
  return (
    <nav className="topnav" aria-label="Primary">
      <a className="skip-link" href="#main">Skip to content</a>
      <NavLink to="/worlds" className={({isActive})=>isActive?"active":""}>Worlds</NavLink>
      <NavLink to="/zones" className={({isActive})=>isActive?"active":""}>Zones</NavLink>
      <NavLink to="/marketplace" className={({isActive})=>isActive?"active":""}>Marketplace</NavLink>
      <NavLink to="/naturversity" className={({isActive})=>isActive?"active":""}>Naturversity</NavLink>
      <NavLink to="/passport" className={({isActive})=>isActive?"active":""}>Passport</NavLink>
      <NavLink to="/turian" className={({isActive})=>isActive?"active":""}>Turian</NavLink>
      <NavLink to="/profile" className={({isActive})=>isActive?"active":""} aria-label="Profile">👤</NavLink>
      <NavLink to="/cart" className={({isActive})=>isActive?"active":""} aria-label="Cart">🛒</NavLink>
    </nav>
  );
}
