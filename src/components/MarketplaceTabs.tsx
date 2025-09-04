import { Link, useLocation } from 'react-router-dom';

type Tab = { href: string; label: string; key: string };

const TABS: Tab[] = [
  { href: '/marketplace',          label: 'Overview', key: 'index' },
  { href: '/marketplace/wishlist', label: 'Wishlist', key: 'wishlist' },
  { href: '/marketplace/specials', label: 'Specials', key: 'specials' },
  { href: '/marketplace/nft',      label: 'NFT',      key: 'nft' },
  { href: '/marketplace/mint',     label: 'Mint',     key: 'mint' },
  { href: '/marketplace/seasonal', label: 'Seasonal', key: 'seasonal' },
];

function classNames(...xs: (string | false | undefined)[]) {
  return xs.filter(Boolean).join(' ');
}

export default function MarketplaceTabs() {
  const location = useLocation();

  return (
    <nav aria-label="Marketplace sections" className="mt-2 mb-6">
      {/* Breadcrumb line (brand blue) */}
      <div className="text-sm mb-3">
        <Link to="/" className="link brand-blue">Home</Link>
        <span className="mx-1">/</span>
        <Link to="/marketplace" className="link brand-blue">Marketplace</Link>
      </div>

      {/* Tabs */}
      <ul className="flex flex-wrap gap-2">
        {TABS.map(tab => {
          const active = location.pathname === tab.href;
          return (
            <li key={tab.key}>
              <Link
                to={tab.href}
                className={classNames(
                  'btn btn-tab',
                  active && 'btn-tab-active'
                )}
              >
                {tab.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
