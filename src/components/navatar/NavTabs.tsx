import { Link, useLocation } from 'react-router-dom';

const tabs = [
  { to: '/navatar', label: 'My Navatar' },
  { to: '/navatar/card', label: 'Card' },
  { to: '/navatar/pick', label: 'Pick' },
  { to: '/navatar/upload', label: 'Upload' },
  { to: '/navatar/generate', label: 'Generate' },
  { to: '/navatar/mint', label: 'NFT / Mint' },
  { to: '/navatar/marketplace', label: 'Marketplace' },
];

export default function NavTabs() {
  const { pathname } = useLocation();
  return (
    <div style={{ display:'flex', gap:12, flexWrap:'wrap', marginBottom:16 }}>
      {tabs.map(t => {
        const active = pathname === t.to;
        return (
          <Link
            key={t.to}
            to={t.to}
            className={`px-4 py-2 rounded-full border ${active ? 'bg-blue-600 text-white' : 'bg-white text-blue-700'} shadow-sm`}
          >
            {t.label}
          </Link>
        );
      })}
    </div>
  );
}

