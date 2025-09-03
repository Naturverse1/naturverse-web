import { Link, useLocation } from "react-router-dom";
import * as React from "react";

type Crumb = { label: string; href?: string };

const LABELS: Record<string, string> = {
  "": "Home",
  worlds: "Worlds",
  naturversity: "Naturversity",
  languages: "Languages",
  zones: "Zones",
  marketplace: "Marketplace",
  naturbank: "NaturBank",
  navatar: "Navatar",
  passport: "Passport",
  turian: "Turian",
  profile: "Profile",
  "arcade": "Arcade",
  "music": "Music",
  "wellness": "Wellness",
  "creator-lab": "Creator Lab",
  community: "Community",
  culture: "Culture",
  future: "Future",
  observations: "Observations",
  quizzes: "Quizzes",
  stories: "Stories",
};

export function Breadcrumbs(props: { items?: Crumb[] }) {
  const location = useLocation();

  // Allow explicit items to override auto mode when needed
  const items: Crumb[] = React.useMemo(() => {
    if (props.items?.length) return props.items;

    const parts = location.pathname.replace(/^\/+|\/+$/g, "").split("/");
    const acc: Crumb[] = [];
    let path = "";

    // Always include Home
    acc.push({ label: "Home", href: "/" });

    parts.forEach((seg, i) => {
      if (!seg) return;
      path += `/${seg}`;
      const label = LABELS[seg.toLowerCase()] ?? seg.replace(/-/g, " ");
      const isLast = i === parts.length - 1;
      acc.push({ label, href: isLast ? undefined : path });
    });

    return acc;
  }, [location.pathname, props.items]);

  if (items.length <= 1) return null;

  return (
    <nav aria-label="breadcrumb" className="nv-breadcrumbs brand-blue">
      <ol>
        {items.map((c, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={`${c.label}-${i}`} aria-current={isLast ? "page" : undefined}>
              {c.href && !isLast ? <Link to={c.href}>{c.label}</Link> : <span>{c.label}</span>}
              {!isLast && <span className="sep"> / </span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
export default Breadcrumbs;
