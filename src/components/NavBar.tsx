import { Link, useNavigate } from "react-router-dom";

const isActive = (href: string) => {
  try {
    const path = window.location?.pathname || "/";
    return path === href || (href !== "/" && path.startsWith(href));
  } catch {
    return false;
  }
};

export default function NavBar() {
  const navigate = useNavigate();
  return (
    <header>
      <a href="#main" className="skip-link">Skip to content</a>
      <nav className="navbar topnav" aria-label="Primary">
        <Link to="/" className={`nav-link ${isActive("/") ? "active" : ""}`}>Home</Link>
        <Link to="/worlds" className={`nav-link ${isActive("/worlds") ? "active" : ""}`}>Worlds</Link>
        <Link to="/zones" className={`nav-link ${isActive("/zones") ? "active" : ""}`}>Zones</Link>
        <Link to="/marketplace" className={`nav-link ${isActive("/marketplace") ? "active" : ""}`}>Marketplace</Link>
        <Link to="/marketplace/catalog" className={`nav-link ${isActive("/marketplace/catalog") ? "active" : ""}`}>Catalog</Link>
        <Link to="/marketplace/wishlist" className={`nav-link ${isActive("/marketplace/wishlist") ? "active" : ""}`}>Wishlist</Link>
        <Link to="/naturversity" className={`nav-link ${isActive("/naturversity") ? "active" : ""}`}>Naturversity</Link>
        <Link to="/naturbank" className={`nav-link ${isActive("/naturbank") ? "active" : ""}`}>NaturBank</Link>
        <Link to="/navatar" className={`nav-link ${isActive("/navatar") ? "active" : ""}`}>Navatar</Link>
        <Link to="/passport" className={`nav-link ${isActive("/passport") ? "active" : ""}`}>Passport</Link>
        <Link to="/turian" className={`nav-link ${isActive("/turian") ? "active" : ""}`}>Turian</Link>
        <Link to="/profile" className={`nav-link ${isActive("/profile") ? "active" : ""}`}>Profile</Link>
        <button
          aria-label="Cart"
          onClick={() => navigate("/marketplace/checkout")}
          className="icon-btn"
        >
          {/* your cart svg */}
        </button>
      </nav>
    </header>
  );
}
