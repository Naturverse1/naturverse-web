import { Link } from 'react-router-dom';

export default function Breadcrumbs({ trail }: { trail: { to?: string; label: string }[] }) {
  return (
    <div className="text-sm text-blue-700 mb-3">
      <Link to="/">Home</Link>
      {trail.map((t, i) => (
        <span key={i} className="ml-1">
          {' / '}
          {t.to ? <Link to={t.to}>{t.label}</Link> : <span>{t.label}</span>}
        </span>
      ))}
    </div>
  );
}

