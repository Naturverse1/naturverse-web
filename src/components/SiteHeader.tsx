import { Link, NavLink } from 'react-router-dom';
import { useState } from 'react';
import styles from './site-header.module.css';
import Img from './Img';
import AuthButton from './AuthButton';
import CartButton from './CartButton';
import SearchBar from './SearchBar';
import WalletConnect from './WalletConnect';
import ProfileMini from './ProfileMini';
import MobileMenu from './mobile-menu';
import { useAuth } from '@/lib/auth-context';

export default function SiteHeader() {
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.row}>
        <Link to="/" className={styles.brand} onClick={() => setMenuOpen(false)}>
          <Img src="/favicon-32x32.png" width={28} height={28} alt="" className={styles.brandMark} />
          <span className={styles.brandText}>The Naturverse</span>
        </Link>

        {user && (
          <nav className={styles.nav} aria-label="Primary">
            <NavLink to="/worlds">Worlds</NavLink>
            <NavLink to="/zones">Zones</NavLink>
            <NavLink to="/marketplace">Marketplace</NavLink>
            <NavLink to="/wishlist">Wishlist</NavLink>
            <NavLink to="/naturversity">Naturversity</NavLink>
            <NavLink to="/naturbank">NaturBank</NavLink>
            <NavLink to="/navatar">Navatar</NavLink>
            <NavLink to="/passport">Passport</NavLink>
            <NavLink to="/turian">Turian</NavLink>
          </nav>
        )}

        <div className={styles.right}>
          <div style={{ minWidth: 280 }}>
            <SearchBar />
          </div>
          <AuthButton />
          <ProfileMini />
          <WalletConnect />
          <CartButton />
        </div>

        <button
          className={styles.burger}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <MobileMenu id="mobile-menu" open={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  );
}
