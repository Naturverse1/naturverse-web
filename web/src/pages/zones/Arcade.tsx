import React from "react";
import { Link } from "react-router-dom";

export default function Arcade() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 text-white">
      <h1 className="text-3xl font-bold">Arcade</h1>
      <p className="text-white/80 mt-2">Quick brain-boost games (first mini-game ships next!).</p>

      <ul className="mt-6 list-disc pl-6 space-y-2 text-white/90">
        <li>
          <span className="opacity-70">Memory Match</span> – coming soon
        </li>
        <li>
          <span className="opacity-70">Word Builder</span> – coming soon
        </li>
        <li>
          <span className="opacity-70">Eco Runner</span> – coming soon
        </li>
      </ul>

      <div className="mt-6">
        <Link to="/zones" className="underline text-sky-300">
          Back to Zones
        </Link>
      </div>
    </main>
  );
}
