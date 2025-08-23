import { useEffect, useState } from 'react';

export default function NavBar() {
  const [path, setPath] = useState<string>(location.pathname);
  useEffect(() => {
    const onPop = () => setPath(location.pathname);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  return (
    <nav className="topnav" aria-label="Primary">
      <a href="/" className={path === '/' ? 'active' : undefined} aria-current={path === '/' ? 'page' : undefined}>Home</a>
      <a href="/worlds" className={path.startsWith('/worlds') ? 'active' : undefined} aria-current={path.startsWith('/worlds') ? 'page' : undefined}>Worlds</a>
      <a href="/zones" className={path.startsWith('/zones') ? 'active' : undefined} aria-current={path.startsWith('/zones') ? 'page' : undefined}>Zones</a>
      <a href="/marketplace" className={path.startsWith('/marketplace') ? 'active' : undefined} aria-current={path.startsWith('/marketplace') ? 'page' : undefined}>Marketplace</a>
      <a href="/naturversity" className={path.startsWith('/naturversity') ? 'active' : undefined} aria-current={path.startsWith('/naturversity') ? 'page' : undefined}>Naturversity</a>
        <a
          href="/naturbank"
          className={`nav-link${path.startsWith('/naturbank') ? ' active' : ''}`}
          aria-current={path.startsWith('/naturbank') ? 'page' : undefined}
        >
          NaturBank
        </a>
      <a href="/navatar" className={path.startsWith('/navatar') ? 'active' : undefined} aria-current={path.startsWith('/navatar') ? 'page' : undefined}>Navatar</a>
      <a
        href="/passport"
        className={`nav-link${path.startsWith('/passport') ? ' active' : ''}`}
        aria-current={path.startsWith('/passport') ? 'page' : undefined}
      >
        Passport
      </a>
      <a href="/turian" className={path.startsWith('/turian') ? 'active' : undefined} aria-current={path.startsWith('/turian') ? 'page' : undefined}>Turian</a>
      <a href="/profile" className={path.startsWith('/profile') ? 'active' : undefined} aria-current={path.startsWith('/profile') ? 'page' : undefined}>Profile</a>
    </nav>
  );
}
