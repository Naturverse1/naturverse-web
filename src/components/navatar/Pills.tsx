import React from 'react';
import { Link } from 'react-router-dom';

type Nav = { slug: string; to: string; label: string };

const NAVATAR_TABS: Nav[] = [
  { slug: 'my', to: '/navatar', label: 'My Navatar' },
  { slug: 'card', to: '/navatar/card', label: 'Card' },
  { slug: 'pick', to: '/navatar/pick', label: 'Pick' },
  { slug: 'upload', to: '/navatar/upload', label: 'Upload' },
  { slug: 'generate', to: '/navatar/generate', label: 'Generate' },
  { slug: 'market', to: '/navatar/marketplace', label: 'Marketplace' },
];

type Props = {
  hub: 'navatar';
  active: string;
  hideOnMobileSubpages?: boolean;
};

export function Pills({ hub, active, hideOnMobileSubpages }: Props) {
  const items = hub === 'navatar' ? NAVATAR_TABS : [];
  const hide = hideOnMobileSubpages && active !== 'my';
  return (
    <nav
      className={`nav-tabs${hide ? ' nv-hide-mobile' : ''}`}
      aria-label={`${hub} navigation`}
    >
      {items.map((t) => (
        <Link
          key={t.to}
          to={t.to}
          className={`pill${active === t.slug ? ' pill--active' : ''}`}
        >
          {t.label}
        </Link>
      ))}
    </nav>
  );
}

