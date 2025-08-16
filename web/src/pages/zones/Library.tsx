import React from "react";
export default function Library() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10 text-white">
      <h1 className="text-3xl font-bold">Library</h1>
      <p className="text-white/80 mt-2">Stories, lore, and knowledge base.</p>
      <ul className="list-disc ml-6 mt-6 text-white/70">
        <li>Story cards (read mode)</li>
        <li>Glossary (animals, plants, places)</li>
        <li>"Ask Turian" Q&A (later with AI)</li>
      </ul>
    </main>
  );
}
