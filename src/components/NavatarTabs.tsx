import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './NavatarTabs.module.css';

export default function NavatarTabs() {
  const { pathname } = useLocation();
  const base = '/navatar';

  const tabs = [
    { to: `${base}`, label: 'My Navatar', match: (p:string) => p === base || p === `${base}/` },
    { to: `${base}/card`, label: 'Card' },
    { to: `${base}/pick`, label: 'Pick' },
    { to: `${base}/upload`, label: 'Upload' },
    { to: `${base}/generate`, label: 'Generate' },
    { to: `${base}/mint`, label: 'NFT / Mint' },
    { to: `${base}/marketplace`, label: 'Marketplace' },
  ];

  return (
    <nav className={styles.tabs}>
      {tabs.map(t => {
        const active = t.match ? t.match(pathname) : pathname.startsWith(t.to);
        return (
          <Link
            key={t.to}
            to={t.to}
            className={`${styles.pill} ${active ? styles.active : ''}`}
          >
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
