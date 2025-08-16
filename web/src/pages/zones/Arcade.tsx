import React from "react";
export default function Arcade() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10 text-white">
      <h1 className="text-3xl font-bold">Arcade</h1>
      <p className="text-white/80 mt-2">Mini-games and challenges.</p>
      <ul className="list-disc ml-6 mt-6 text-white/70">
        <li>Memory match (animal cards)</li>
        <li>Whack-a-weed (click speed)</li>
        <li>Quiz sprint (timed multiple choice)</li>
      </ul>
    </main>
  );
}
