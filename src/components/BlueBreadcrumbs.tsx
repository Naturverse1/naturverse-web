import { Link } from "react-router-dom";

type Item = { label: string; to?: string };

export function BlueBreadcrumbs({ items }: { items: Item[] }) {
  return (
    <nav aria-label="Breadcrumb" className="breadcrumbs">
      <ol>
        {items.map((c, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={`${c.label}-${i}`} aria-current={isLast ? "page" : undefined} style={{ display: "inline" }}>
              {c.to && !isLast ? <Link to={c.to}>{c.label}</Link> : <span>{c.label}</span>}
              {!isLast && <span> / </span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
