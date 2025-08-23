const isActive = (href: string) => {
  try {
    const p = window.location.pathname;
    if (href === "/") return p === "/";
    return p === href || p.startsWith(href + "/");
  } catch {
    return false;
  }
};

export default function NavBar() {
  return (
    <nav className="topnav" aria-label="Primary">
      <a
        href="/"
        className={isActive("/") ? "active" : ""}
        aria-current={isActive("/") ? "page" : undefined}
      >
        Home
      </a>
      <a
        href="/worlds"
        className={isActive("/worlds") ? "active" : ""}
        aria-current={isActive("/worlds") ? "page" : undefined}
      >
        Worlds
      </a>
      <a
        href="/zones"
        className={isActive("/zones") ? "active" : ""}
        aria-current={isActive("/zones") ? "page" : undefined}
      >
        Zones
      </a>
      <a
        href="/marketplace"
        className={isActive("/marketplace") ? "active" : ""}
        aria-current={isActive("/marketplace") ? "page" : undefined}
      >
        Marketplace
      </a>
      <a
        href="/naturversity"
        className={isActive("/naturversity") ? "active" : ""}
        aria-current={isActive("/naturversity") ? "page" : undefined}
      >
        Naturversity
      </a>
      <a
        href="/naturbank"
        className={isActive("/naturbank") ? "active" : ""}
        aria-current={isActive("/naturbank") ? "page" : undefined}
      >
        Naturbank
      </a>
      <a
        href="/navatar"
        className={isActive("/navatar") ? "active" : ""}
        aria-current={isActive("/navatar") ? "page" : undefined}
      >
        Navatar
      </a>
      <a
        href="/passport"
        className={isActive("/passport") ? "active" : ""}
        aria-current={isActive("/passport") ? "page" : undefined}
      >
        Passport
      </a>
      <a
        href="/turian"
        className={isActive("/turian") ? "active" : ""}
        aria-current={isActive("/turian") ? "page" : undefined}
      >
        Turian
      </a>
      <a
        href="/profile"
        className={isActive("/profile") ? "active" : ""}
        aria-current={isActive("/profile") ? "page" : undefined}
      >
        Profile
      </a>
    </nav>
  );
}

