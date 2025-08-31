import { useState, useEffect } from 'react';
import { useCart } from '../lib/cart';
import CartDrawer from './CartDrawer';
import styles from './Header.module.css';

type LinkItem = { label: string; to: string };

const PRIMARY_LINKS: LinkItem[] = [
  { label: 'Worlds', to: '/worlds' },
  { label: 'Zones', to: '/zones' },
  { label: 'Quests', to: '/quests' },
  { label: 'Marketplace', to: '/marketplace' },
];

const MORE_LINKS: LinkItem[] = [
  { label: 'Wishlist', to: '/wishlist' },
  { label: 'Naturversity', to: '/naturversity' },
  { label: 'NaturBank', to: '/naturbank' },
  { label: 'Navatar', to: '/navatar' },
  { label: 'Passport', to: '/passport' },
  { label: 'Create Navatar', to: '/create-navatar' },
];

export default function Header() {
  const { items } = useCart();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.brandRow}>
        {/* left: logo/brand */}
        <a href="/" className={styles.brand}>
          <img src="/logo-64.png" alt="Naturverse logo" className={styles.logo} />
          <span className={styles.brandText}>Naturverse</span>
        </a>

        {/* center: primary nav */}
        <nav className={styles.nav}>
          {PRIMARY_LINKS.map((l) => (
            <a key={l.to} href={l.to} className={styles.navLink}>
              {l.label}
            </a>
          ))}

          <details className={styles.more} role="list">
            <summary className={styles.moreButton}>More</summary>
            <ul className={styles.moreMenu} role="listbox">
              {MORE_LINKS.map((l) => (
                <li key={l.to}>
                  <a href={l.to} className={styles.moreLink}>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </details>
        </nav>

        {/* right: search + user/wallet (keep your existing components if any) */}
        <div className={styles.actions}>
          {/* keep your search input component here */}
          {/* keep your connect wallet / auth avatar here */}
          <button className="cart-btn" onClick={() => setOpen(true)}>
            🛒 {items.length > 0 && <span className="cart-count">{items.length}</span>}
          </button>
        </div>

        {/* mobile hamburger toggles a drawer with ALL links */}
        <input id="nv-mobile-toggle" type="checkbox" className={styles.drawerToggler} />
        <label htmlFor="nv-mobile-toggle" className={styles.hamburger} aria-label="Open menu">
          ☰
        </label>
        <aside className={styles.drawer}>
          <nav>
            {[...PRIMARY_LINKS, ...MORE_LINKS].map((l) => (
              <a key={l.to} href={l.to} className={styles.drawerLink}>
                {l.label}
              </a>
            ))}
          </nav>
        </aside>
      </div>

      <CartDrawer open={open} onClose={() => setOpen(false)} />
    </header>
  );
}
