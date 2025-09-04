import { Link, useLocation } from "react-router-dom";
import React, { useMemo } from "react";

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

export function Breadcrumbs({ items }: { items?: Crumb[] }) {
  const location = useLocation();

  const computed: Crumb[] = useMemo(() => {
    if (items?.length) return items;

    const parts = location.pathname.replace(/^\/+|\/+$/g, "").split("/");
    const acc: Crumb[] = [{ label: "Home", href: "/" }];
    let path = "";

    parts.forEach((seg, i) => {
      if (!seg) return;
      path += `/${seg}`;
      const label = LABELS[seg.toLowerCase()] ?? seg.replace(/-/g, " ");
      const isLast = i === parts.length - 1;
      acc.push({ label, href: isLast ? undefined : path });
    });

    return acc;
  }, [location.pathname, items]);

  if (computed.length <= 1) return null;

  return (
    <nav aria-label="breadcrumb" className="mb-4">
      <ol className="flex flex-wrap gap-2 text-sm text-muted">
        {computed.map((it, i) => (
          <li key={i} className="flex items-center gap-2">
            {it.href ? (
              <Link to={it.href} className="hover:underline">
                {it.label}
              </Link>
            ) : (
              <span className="text-strong">{it.label}</span>
            )}
            {i < computed.length - 1 && <span className="text-muted">/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export default Breadcrumbs;
