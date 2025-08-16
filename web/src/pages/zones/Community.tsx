import React from "react";

export default function Community() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 text-white">
      <h1 className="text-3xl font-bold">Community</h1>
      <p className="text-white/80 mt-2">
        Updates, highlights, and community guidelines. This is a friendly, moderated space.
      </p>

      <section className="mt-6 rounded-lg border border-white/10 bg-white/5 p-4">
        <h2 className="text-xl font-semibold">Guidelines (draft)</h2>
        <ul className="mt-3 list-disc pl-6 space-y-1 text-white/80">
          <li>Be kind and curious.</li>
          <li>No sharing private info.</li>
          <li>Celebrate creativity and learning.</li>
        </ul>
      </section>

      <section className="mt-6 rounded-lg border border-white/10 bg-white/5 p-4">
        <h2 className="text-xl font-semibold">News</h2>
        <p className="text-white/80 mt-2">New zones are live! Tell us which one to polish first.</p>
      </section>
    </main>
  );
}
