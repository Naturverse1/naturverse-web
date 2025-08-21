import { Link } from "react-router-dom";

export type Crumb = { label: string; to?: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-3 text-sm">
      <ol className="flex flex-wrap gap-2 text-gray-600">
        {items.map((c, i) => (
          <li key={i} className="flex items-center">
            {c.to ? (
              <Link to={c.to} className="hover:underline">{c.label}</Link>
            ) : (
              <span className="text-gray-800">{c.label}</span>
            )}
            {i < items.length - 1 && <span className="mx-2 text-gray-400">/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
