import React from 'react';
import { Link } from 'react-router-dom';
import styles from './NavatarTabs.module.css';

type TabKey = 'my' | 'card' | 'pick' | 'upload' | 'generate' | 'mint' | 'marketplace';

export function NavatarTabs({
  active,
  context = 'subpage',
}: {
  active: TabKey;
  context?: 'hub' | 'subpage';
}) {
  const mobileClass = context === 'hub' ? styles.showOnMobile : styles.hideOnMobile;

  const base = '/navatar';
  const tabs = [
    { key: 'my', to: `${base}`, label: 'My Navatar' },
    { key: 'card', to: `${base}/card`, label: 'Card' },
    { key: 'pick', to: `${base}/pick`, label: 'Pick' },
    { key: 'upload', to: `${base}/upload`, label: 'Upload' },
    { key: 'generate', to: `${base}/generate`, label: 'Generate' },
    { key: 'mint', to: `${base}/mint`, label: 'NFT / Mint' },
    { key: 'marketplace', to: `${base}/marketplace`, label: 'Marketplace' },
  ] as const;

  return (
    <nav className={`${styles.tabs} ${mobileClass}`}>
      {tabs.map(t => (
        <Link
          key={t.key}
          to={t.to}
          className={`${styles.pill} ${active === t.key ? styles.active : ''}`}
        >
          {t.label}
        </Link>
      ))}
    </nav>
  );
}

export default NavatarTabs;
