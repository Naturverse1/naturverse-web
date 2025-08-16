import React from "react";

export default function Naturversity() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10 text-white">
      <h1 className="text-3xl font-bold">Naturversity</h1>
      <p className="text-white/80 mt-2">Guided lessons, quests, and projects.</p>
      <section className="mt-6 space-y-2 text-white/70">
        <p>Next steps:</p>
        <ul className="list-disc ml-6">
          <li>Lesson list component (units → lessons → activities)</li>
          <li>Progress tracking (local first; Supabase later)</li>
          <li>Badge system (complete quests → badges)</li>
        </ul>
      </section>
    </main>
  );
}
