import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./../styles/navatar.css";

type Crumb = { href?: string; label: string };

export function Breadcrumbs({ items }: { items?: Crumb[] }) {
  const location = useLocation();
  const crumbs = React.useMemo(() => {
    if (items?.length) return items;
    const parts = location.pathname.replace(/^\/+/,'').split('/');
    const acc: Crumb[] = [{ href: '/', label: 'Home' }];
    let path = '';
    parts.forEach((seg, i) => {
      if (!seg) return;
      path += `/${seg}`;
      const isLast = i === parts.length - 1;
      acc.push({ label: seg.replace(/-/g, ' '), href: isLast ? undefined : path });
    });
    return acc;
  }, [items, location.pathname]);

  if (crumbs.length <= 1) return null;

  return (
    <nav aria-label="Breadcrumb" className="nv-bc">
      <ol>
        {crumbs.map((c, i) => (
          <li key={i}>
            {c.href ? <Link to={c.href}>{c.label}</Link> : <span>{c.label}</span>}
            {i < crumbs.length - 1 && <span className="sep">/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export default Breadcrumbs;
