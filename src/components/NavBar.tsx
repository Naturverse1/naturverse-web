'use client';

import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import styles from './NavBar.module.css';
import './NavBar.css';
import { useAuth } from '@/lib/auth-context';
import SearchBar from './SearchBar';
import CartButton from './CartButton';
import CartDrawer from './CartDrawer';

export default function NavBar() {
  const { ready, user } = useAuth();
  const [open, setOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const emoji = (user?.user_metadata?.navemoji as string) ?? '🧑';

  return (
    <>
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

        <div style={{ marginLeft: 'auto', minWidth: 280 }}>
          <SearchBar />
        </div>
        <div className={styles.right} key={user?.id ?? 'anon'}>
          {ready && user && (
            <>
              <CartButton onClick={() => setCartOpen(true)} />
              <NavLink
                to="/profile"
                aria-label="Profile"
                className={styles.profileBtn}
              >
                {emoji}
              </NavLink>
            </>
          )}
        </div>

        {ready && user && (
          <div className={styles.mobile}>
            <CartButton onClick={() => setCartOpen(true)} />
            <button
              className={`${styles.hamburger} nav-toggle`}
              aria-label="Open menu"
              onClick={() => setOpen(true)}
            >
              <span className={styles.bar} />
              <span className={styles.bar} />
              <span className={styles.bar} />
            </button>

            {open && (
              <div className={styles.sheet} onClick={() => setOpen(false)}>
                <div
                  className={styles.sheetBody}
                  onClick={(e) => e.stopPropagation()}
                >
                  <NavLink to="/profile" className={styles.mobileLink}>
                    Profile
                  </NavLink>
                  <NavLink to="/worlds" className={styles.mobileLink}>
                    Worlds
                  </NavLink>
                  <NavLink to="/zones" className={styles.mobileLink}>
                    Zones
                  </NavLink>
                  <NavLink to="/marketplace" className={styles.mobileLink}>
                    Marketplace
                  </NavLink>
                  <NavLink to="/wishlist" className={styles.mobileLink}>
                    Wishlist
                  </NavLink>
                  <NavLink to="/naturversity" className={styles.mobileLink}>
                    Naturversity
                  </NavLink>
                  <NavLink to="/naturbank" className={styles.mobileLink}>
                    NaturBank
                  </NavLink>
                  <NavLink to="/navatar" className={styles.mobileLink}>
                    Navatar
                  </NavLink>
                  <NavLink to="/passport" className={styles.mobileLink}>
                    Passport
                  </NavLink>
                  <NavLink to="/turian" className={styles.mobileLink}>
                    Turian
                  </NavLink>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
    <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
