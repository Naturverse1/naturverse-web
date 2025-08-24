const isActive = (href: string) => {
  try {
    const path = window.location?.pathname || "/";
    return path === href || (href !== "/" && path.startsWith(href));
  } catch {
    return false;
  }
};

export default function NavBar() {
  return (
    <header>
      <a href="#main" className="skip-link">Skip to content</a>
      <nav className="navbar topnav" aria-label="Primary">
        <a href="/" className={`nav-link ${isActive("/") ? "active" : ""}`}>Home</a>
        <a href="/worlds" className={`nav-link ${isActive("/worlds") ? "active" : ""}`}>Worlds</a>
        <a href="/zones" className={`nav-link ${isActive("/zones") ? "active" : ""}`}>Zones</a>
        <a href="/marketplace" className={`nav-link ${isActive("/marketplace") ? "active" : ""}`}>Marketplace</a>
        <a href="/naturversity" className={`nav-link ${isActive("/naturversity") ? "active" : ""}`}>Naturversity</a>
        <a href="/naturbank" className={`nav-link ${isActive("/naturbank") ? "active" : ""}`}>NaturBank</a>
        <a href="/navatar" className={`nav-link ${isActive("/navatar") ? "active" : ""}`}>Navatar</a>
        <a href="/passport" className={`nav-link ${isActive("/passport") ? "active" : ""}`}>Passport</a>
        <a href="/turian" className={`nav-link ${isActive("/turian") ? "active" : ""}`}>Turian</a>
        <a href="/profile" className={`nav-link ${isActive("/profile") ? "active" : ""}`}>Profile</a>
      </nav>
    </header>
  );
}
