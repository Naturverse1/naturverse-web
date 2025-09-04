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
              alt="The Naturverse"
              className="nv-logo"
              width={40}
              height={40}
              loading="eager"
              decoding="async"
            />
          </picture>

            <span className="nv-brand text-nv-blue">The Naturverse</span>
        </a>

        <nav className={styles.links} aria-label="Primary">
          <Link to="/worlds">Worlds</Link>
          <Link to="/zones">Zones</Link>
          <Link to="/marketplace">Marketplace</Link>
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
            <Link to="/profile" className={styles.mobileProfile}>
              <span className={styles.mobileEmoji}>{emoji}</span>
              <span>Profile</span>
            </Link>
          )}
          <Link to="/worlds">Worlds</Link>
          <Link to="/zones">Zones</Link>
          <Link to="/marketplace">Marketplace</Link>
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
