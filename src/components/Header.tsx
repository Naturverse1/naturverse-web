import { Link } from 'react-router-dom'
import styles from './Header.module.css'
import CartButton from './CartButton'
import { useAuth } from '../hooks/useAuth'
import { useEffect, useState } from 'react'
import { getActive } from '../lib/navatar'
import { getNavatarMeta } from '../lib/navatar-meta'

function HeaderNavatar() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const meta = getNavatarMeta(activeId);

  useEffect(() => {
    getActive().then(setActiveId);
    function onStorage(e: StorageEvent) {
      if (e.key === 'nv_active_navatar') getActive().then(setActiveId);
    }
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  if (!meta) return null;

  return (
    <span className="navatar-inline" title={`${meta.name} (${meta.rarity})`}>
      <span className={`navatar-frame ${meta.rarity}`}>
        <img src={meta.img} width={24} height={24} style={{ borderRadius: '50%' }} alt={meta.name} />
      </span>
      <span className="name">{meta.name}</span>
      <a className="action" href="/navatar">Change</a>
    </span>
  );
}

export default function Header() {
  const { user, loading } = useAuth();

  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <Link to="/">🌿 Naturverse</Link>
      </div>

      {!loading && user && (
        <nav className={styles.nav}>
          <HeaderNavatar />
          <Link to="/worlds">Worlds</Link>
          <Link to="/zones">Zones</Link>
          <Link to="/marketplace">Marketplace</Link>
          <Link to="/marketplace/navatar">Navatar Shop</Link>
          <Link to="/wishlist">Wishlist</Link>
          <Link to="/naturversity">Naturversity</Link>
          <Link to="/naturbank">NaturBank</Link>
          <Link to="/passport">Passport</Link>
          <Link to="/turian">Turian</Link>
          <CartButton />
        </nav>
      )}
    </header>
  );
}
