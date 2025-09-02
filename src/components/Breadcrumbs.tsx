import { Link } from 'react-router-dom';
import './breadcrumbs.css';

export function Breadcrumbs({ items }: { items: { to?: string; label: string }[] }) {
  return (
    <nav className="crumbs">
      {items.map((it, i) => (
        <span key={i}>
          {it.to ? <Link to={it.to}>{it.label}</Link> : <span>{it.label}</span>}
          {i < items.length - 1 && ' / '}
        </span>
      ))}
    </nav>
  );
}

export default Breadcrumbs;

