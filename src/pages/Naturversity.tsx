import React from "react";
import { Link } from "react-router-dom";

const tiles = [
  { href: "/naturversity/teachers", emoji: "👩‍🏫", title: "Teachers", desc: "Mentors across the 14 kingdoms." },
  { href: "/naturversity/partners", emoji: "🤝", title: "Partners", desc: "Brands & orgs supporting missions." },
  { href: "/naturversity/courses",  emoji: "📚", title: "Courses",  desc: "Nature, art, music, wellness, crypto." },
];

export default function Naturversity() {
  return (
    <div>
      <h1>Naturversity</h1>
      <p>Learn with mentors, partners, and self-paced courses.</p>
      <div className="hub-grid">
        {tiles.map(t => (
          <Link key={t.href} className="hub-card" to={t.href}>
            <div className="emoji">{t.emoji}</div>
            <div className="title">{t.title}</div>
            <div className="desc">{t.desc}</div>
          </Link>
        ))}
      </div>
      <p className="meta">Coming soon: AI tutors, step-by-step coaching, and verified certificates.</p>
    </div>
  );
}

