import { Link, useLocation } from 'react-router-dom';

const PILLS = [
  { key: 'home', to: '/navatar', label: 'My Navatar' },
  { key: 'card', to: '/navatar/card', label: 'Card' },
  { key: 'pick', to: '/navatar/pick', label: 'Pick' },
  { key: 'upload', to: '/navatar/upload', label: 'Upload' },
  { key: 'generate', to: '/navatar/generate', label: 'Generate' },
  { key: 'marketplace', to: '/navatar/marketplace', label: 'Marketplace' },
];

export function NavatarPills({
  active,
  color = 'blue',
}: {
  active: 'home' | 'pick' | 'upload' | 'generate' | 'marketplace' | 'card';
  color?: 'blue' | 'gray';
}) {
  const { pathname } = useLocation();
  return (
    <div className={`flex flex-wrap gap-3 ${active !== 'home' ? 'hidden md:flex' : ''}`}>
      {PILLS.map(p => {
        const isActive =
          active
            ? active === p.key
            : p.to === '/navatar'
            ? pathname === '/navatar'
            : pathname.startsWith(p.to);
        return (
          <Link
            key={p.key}
            to={p.to}
            className={isActive ? 'nv-btn' : 'nv-btn-outline'}
          >
            {p.label}
          </Link>
        );
      })}
    </div>
  );
}

