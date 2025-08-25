'use client';

import { Link } from 'react-router-dom';
import { useState } from 'react';
import styles from './NavBar.module.css';
import { useAuth } from '@/lib/auth-context';

export default function NavBar() {
  const { ready, user } = useAuth();
  const [open, setOpen] = useState(false);
  const emoji = (user?.user_metadata?.navemoji as string) ?? '🧑';

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link to="/" className={styles.brand}>
          Naturverse
        </Link>

        <nav className={styles.links} aria-label="Primary">
          <Link to="/worlds">Worlds</Link>
          <Link to="/zones">Zones</Link>
          <Link to="/marketplace">Marketplace</Link>
          <Link to="/wishlist">Wishlist</Link>
          <Link to="/naturversity">Naturversity</Link>
          <Link to="/naturbank">NaturBank</Link>
          <Link to="/navatar">Navatar</Link>
          <Link to="/passport">Passport</Link>
          <Link to="/turian">Turian</Link>
        </nav>

        <div className={styles.right} key={user?.id ?? 'anon'}>
          {ready && user && (
            <>
              <Link to="/cart" aria-label="Cart" className={styles.cartBtn}>
                🛒
              </Link>
              <Link to="/profile" aria-label="Profile" className={styles.profileBtn}>
                {emoji}
              </Link>
            </>
          )}

          <button
            aria-label="Open menu"
            className={`nv-menu-btn${open ? ' is-open' : ''}`}
            onClick={() => setOpen(!open)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>

      <div className={`${styles.mobile} ${open ? styles.open : ''}`} onClick={() => setOpen(false)}>
        <div className={styles.sheet} onClick={(e) => e.stopPropagation()}>
          {ready && user && (
            <Link to="/profile" className={styles.mobileProfile}>
              <span className={styles.mobileEmoji}>{emoji}</span>
              <span>Profile</span>
            </Link>
          )}
          <Link to="/worlds">Worlds</Link>
          <Link to="/zones">Zones</Link>
          <Link to="/marketplace">Marketplace</Link>
          <Link to="/wishlist">Wishlist</Link>
          <Link to="/naturversity">Naturversity</Link>
          <Link to="/naturbank">NaturBank</Link>
          <Link to="/navatar">Navatar</Link>
          <Link to="/passport">Passport</Link>
          <Link to="/turian">Turian</Link>
        </div>
      </div>
    </header>
  );
}
