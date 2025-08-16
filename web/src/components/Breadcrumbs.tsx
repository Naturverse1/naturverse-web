import React from "react";
import { Link } from "react-router-dom";

type Crumb = { label: string; to?: string };

type Props = { items: Crumb[] };

export function Breadcrumbs({ items }: Props) {
  return (
    <nav className="text-sm text-white/60 mb-4">
      {items.map((c, i) => (
        <span key={i}>
          {c.to ? (
            <Link to={c.to} className="hover:text-white">
              {c.label}
            </Link>
          ) : (
            c.label
          )}
          {i < items.length - 1 && <span className="px-1">/</span>}
        </span>
      ))}
    </nav>
  );
}
