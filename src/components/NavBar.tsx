import ActiveLink from "./ActiveLink";

export default function NavBar() {
  return (
    <header>
      <a href="#main" className="skip-link">Skip to content</a>
      <nav className="navbar topnav" aria-label="Primary">
        <ActiveLink href="/" exact className="nav-link">Home</ActiveLink>
        <ActiveLink href="/worlds" className="nav-link">Worlds</ActiveLink>
        <ActiveLink href="/zones" className="nav-link">Zones</ActiveLink>
        <ActiveLink href="/marketplace" className="nav-link">Marketplace</ActiveLink>
        <ActiveLink href="/naturversity" className="nav-link">Naturversity</ActiveLink>
        <ActiveLink href="/naturbank" className="nav-link">NaturBank</ActiveLink>
        <ActiveLink href="/navatar" className="nav-link">Navatar</ActiveLink>
        <ActiveLink href="/passport" className="nav-link">Passport</ActiveLink>
        <ActiveLink href="/turian" className="nav-link">Turian</ActiveLink>
        <ActiveLink href="/profile" className="nav-link">Profile</ActiveLink>
      </nav>
    </header>
  );
}
