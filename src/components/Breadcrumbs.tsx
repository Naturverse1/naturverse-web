import React from "react";
import { Link, useLocation } from "react-router-dom";

export function Breadcrumbs() {
  const { pathname } = useLocation();
  const parts = pathname.split("/").filter(Boolean);
  const crumbs = parts.map((p, i) => {
    const href = "/" + parts.slice(0, i + 1).join("/");
    const label = p[0]?.toUpperCase() + p.slice(1);
    return <span key={href}> / <Link to={href}>{label}</Link></span>;
  });
  return <nav aria-label="Breadcrumbs" className="breadcrumbs"><Link to="/">Home</Link>{crumbs}</nav>;
}
