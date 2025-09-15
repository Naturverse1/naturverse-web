import { Link, useLocation } from 'react-router-dom';
import styles from './NavatarTabs.module.css';

type Context = 'hub' | 'subpage';

export default function NavatarTabs({ context = 'hub' }: { context?: Context }) {
  const { pathname } = useLocation();

  const tabs = [
    { to: '/navatar', label: 'My Navatar' },
    { to: '/navatar/card', label: 'Card' },
    { to: '/navatar/pick', label: 'Pick' },
    { to: '/navatar/upload', label: 'Upload' },
    { to: '/navatar/generate', label: 'Generate' },
    { to: '/navatar/mint', label: 'NFT / Mint' },
    { to: '/navatar/marketplace', label: 'Marketplace' },
  ];

  return (
    <nav
      className={[
        styles.nvTabsWrap,
        context === 'subpage' ? styles.mobileHidden : '',
      ].join(' ')}
      aria-label="Navatar pages"
    >
      <ul className={styles.nvTabs}>
        {tabs.map(t => {
          const active = pathname === t.to;
          return (
            <li key={t.to} className={styles.nvTabItem}>
              <Link className={active ? styles.pillActive : styles.pill} to={t.to}>
                {t.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

