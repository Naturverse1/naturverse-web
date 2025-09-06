import { Link } from "react-router-dom";
import "./breadcrumbs.css";

export default function Breadcrumbs({ items = [] }:{
  items?: {href?: string; label: string}[];
}) {
  if (items.length === 0) return null;
  return (
    <nav aria-label="Breadcrumb" className="crumbs">
      {items.map((it, i) => (
        <span key={i} className="crumb">
          {it.href ? <Link to={it.href}>{it.label}</Link> : <span>{it.label}</span>}
          {i < items.length - 1 && " / "}
        </span>
      ))}
    </nav>
  );
}
