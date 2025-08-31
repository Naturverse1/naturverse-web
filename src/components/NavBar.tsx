'use client';

import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import styles from './NavBar.module.css';
import './NavBar.css';
import { useAuth } from '@/lib/auth-context';
import SearchBar from './SearchBar';
import CartButton from './CartButton';

export default function NavBar() {
  const { ready, user } = useAuth();
  const [open, setOpen] = useState(false);
  const emoji = (user?.user_metadata?.navemoji as string) ?? '🧑';

  return (
    <header className={`${styles.header} nv-nav`}>
      <div className={`container ${styles.inner}`}>
        {/* Left brand (logo + wordmark) */}
          <a
            href="/"
            className="flex items-center gap-2"
            aria-label="The Naturverse home"
          >
            <picture>
              <source srcSet="/favicon.svg" type="image/svg+xml" />
              <img
                src="/favicon-64x64.png"
                alt=""
                className="nv-logo"
                width={40}
                height={40}
                loading="eager"
                decoding="async"
              />
            </picture>

            <span className="nv-brand text-nv-blue">The Naturverse</span>
          </a>

        <nav className={`${styles.links} nv-nav__links`} aria-label="Primary">
          <NavLink to="/worlds">Worlds</NavLink>
          <NavLink to="/zones">Zones</NavLink>
          <NavLink to="/marketplace">Marketplace</NavLink>
          <NavLink to="/wishlist">Wishlist</NavLink>
          <NavLink to="/naturversity">Naturversity</NavLink>
          <NavLink to="/naturbank">NaturBank</NavLink>
          <NavLink to="/navatar">Navatar</NavLink>
          <NavLink to="/create/navatar">Create Navatar</NavLink>
          <NavLink to="/passport">Passport</NavLink>
          <NavLink to="/orders">Orders</NavLink>
          <NavLink to="/turian">Turian</NavLink>
        </nav>

        <div style={{ marginLeft: "auto", minWidth: 280 }}>
          <SearchBar />
        </div>
        <div className={styles.right} key={user?.id ?? 'anon'}>
          {ready && user && (
            <>
              <CartButton className={styles.cartBtn} />
              <NavLink to="/profile" aria-label="Profile" className={styles.profileBtn}>
                {emoji}
              </NavLink>
            </>
          )}

          {/* Mobile hamburger (no blue background) */}
          <button
            className="nv-hamburger nav-toggle"
            aria-label="Open menu"
            onClick={() => setOpen(true)}
          >
            <span className="bar" />
            <span className="bar" />
            <span className="bar" />
          </button>
        </div>
      </div>

      <div className={`${styles.mobile} ${open ? styles.open : ''}`} onClick={() => setOpen(false)}>
        <div className={styles.sheet} onClick={(e) => e.stopPropagation()}>
          {ready && user && (
            <NavLink to="/profile" className={styles.mobileProfile}>
              <span className={styles.mobileEmoji}>{emoji}</span>
              <span>Profile</span>
            </NavLink>
          )}
          <NavLink to="/worlds">Worlds</NavLink>
          <NavLink to="/zones">Zones</NavLink>
          <NavLink to="/marketplace">Marketplace</NavLink>
          <NavLink to="/wishlist">Wishlist</NavLink>
          <NavLink to="/naturversity">Naturversity</NavLink>
          <NavLink to="/naturbank">NaturBank</NavLink>
          <NavLink to="/navatar">Navatar</NavLink>
          <NavLink to="/create/navatar">Create Navatar</NavLink>
          <NavLink to="/passport">Passport</NavLink>
          <NavLink to="/orders">Orders</NavLink>
          <NavLink to="/turian">Turian</NavLink>
        </div>
      </div>
    </header>
  );
}
