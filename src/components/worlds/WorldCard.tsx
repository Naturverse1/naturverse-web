import { Link } from 'react-router-dom';
import type { World } from '../../types/worlds';

export default function WorldCard({ w }: { w: World }) {
  const disabled = w.status !== 'available';
  return (
    <Link
      to={disabled ? '#' : `/worlds/${w.slug}`}
      aria-disabled={disabled}
      className={`block rounded-lg border p-4 ${disabled ? 'opacity-60 pointer-events-none' : 'hover:shadow'}`}
    >
      <div className="text-lg font-semibold">{w.name}</div>
      <div className="text-sm opacity-80">{w.subtitle}</div>
      <div className="mt-2 text-xl">{w.emojis.join(' ')}</div>
    </Link>
  );
}

