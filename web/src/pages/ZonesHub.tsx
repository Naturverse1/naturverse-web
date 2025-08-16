import React from "react";
import { Link } from "react-router-dom";

const zones = [
  { slug: "naturversity", title: "Naturversity", blurb: "Guided lessons, quests, and projects." },
  { slug: "music", title: "Music Zone", blurb: "Songs, soundscapes, and rhythm games." },
  { slug: "wellness", title: "Wellness Zone", blurb: "Breathing, mindfulness, and movement." },
  { slug: "maker-lab", title: "Maker Lab", blurb: "Crafts, experiments, and build-along activities." },
  { slug: "arcade", title: "Arcade", blurb: "Mini-games and challenges." },
  { slug: "library", title: "Library", blurb: "Stories, lore, and knowledge base." },
];

export default function ZonesHub() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10 text-white">
      <h1 className="text-3xl font-bold mb-6">Explore Zones</h1>
      <ul className="grid sm:grid-cols-2 gap-4">
        {zones.map(z => (
          <li key={z.slug} className="rounded-lg border border-white/10 bg-white/5 p-4">
            <h2 className="text-xl font-semibold">{z.title}</h2>
            <p className="text-white/80 mt-1">{z.blurb}</p>
            <Link to={`/zones/${z.slug}`} className="inline-block mt-3 text-sky-300 hover:text-sky-200 underline">
              Enter
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
