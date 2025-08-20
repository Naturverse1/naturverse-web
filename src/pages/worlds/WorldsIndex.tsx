import React from "react";
import { WORLDS } from "../../lib/content";
import { Link } from "react-router-dom";

export default function WorldsIndex() {
  const entries = Object.entries(WORLDS);
  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">The 14 Kingdoms</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {entries.map(([key, w]) => (
          <Link key={key} to={`/worlds/${key}`} className="border rounded overflow-hidden hover:shadow">
            {w.bannerImage && <img src={w.bannerImage} alt={w.title} className="w-full h-40 object-cover" />}
            <div className="p-3">
              <div className="font-semibold">{w.title}</div>
              <div className="text-sm text-neutral-600">{w.fruitAnimal}</div>
              <p className="text-sm mt-1">{w.blurb}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
