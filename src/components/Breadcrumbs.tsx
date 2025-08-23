import React from "react";
export default function Breadcrumbs({ items, className = "" }: { items: { href?: string; label: string }[]; className?: string; }) {
  if (!items?.length) return null;
  return (
    <nav aria-label="Breadcrumb" className={`crumbs ${className}`}>
      <ol>
        {items.map((it, i) => (
          <li key={i} className="crumb">
            {it.href ? <a href={it.href}>{it.label}</a> : <span>{it.label}</span>}
            {i < items.length - 1 && <span className="sep"> / </span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
