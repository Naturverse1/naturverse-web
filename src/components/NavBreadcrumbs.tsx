import { Link } from "react-router-dom";

type Crumb = { to?: string; label: string };

export default function NavBreadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="nv-bc">
      {items.map((c, i) => (
        <span key={i} className="nv-bc-item">
          {c.to ? <Link to={c.to}>{c.label}</Link> : <span>{c.label}</span>}
          {i < items.length - 1 && <span className="nv-bc-sep">/</span>}
        </span>
      ))}
    </nav>
  );
}
