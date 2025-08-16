import React from "react";
import { Link } from "react-router-dom";

const worlds = [
  { slug: "tropical-rainforest", title: "Tropical Rainforest", blurb: "Explore lush rainforests with Turian." },
  { slug: "ocean-adventures", title: "Ocean Adventures", blurb: "Dive into crystal-clear waters." },
  { slug: "magical-stories", title: "Magical Stories", blurb: "Read stories of transformation and nature’s magic." },
  { slug: "brain-challenge", title: "Brain Challenge", blurb: "Test your knowledge with fun quizzes!" },
];

export default function Worlds() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10 text-white">
      <h1 className="text-3xl font-bold mb-6">Explore Amazing Worlds</h1>
      <ul className="grid sm:grid-cols-2 gap-4">
        {worlds.map(w => (
          <li key={w.slug} className="rounded-lg border border-white/10 bg-white/5 p-4">
            <h2 className="text-xl font-semibold">{w.title}</h2>
            <p className="text-white/80 mt-1">{w.blurb}</p>
            <Link to={`/worlds/${w.slug}`} className="inline-block mt-3 text-sky-300 hover:text-sky-200 underline">
              Enter
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
