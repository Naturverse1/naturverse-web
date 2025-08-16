import React from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export default function MusicZone() {
  const samples = ["Kick", "Snare", "Hi-hat", "Bass", "Synth"];

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 text-white">
      <Breadcrumbs
        items={[
          { label: "Naturverse" },
          { label: "Home", to: "/" },
          { label: "Zones", to: "/zones" },
          { label: "Music Zone" }
        ]}
      />
      <h1 className="text-3xl font-bold">Music Zone</h1>
      <p className="text-white/80 mt-2">Make loops, layer beats, and learn rhythm.</p>

      <section className="mt-6 rounded-lg border border-white/10 bg-white/5 p-4">
        <h2 className="text-xl font-semibold">Loop Maker</h2>
        <button className="mt-3 rounded-md bg-white/10 px-4 py-2" disabled>
          Open Loop Maker
        </button>
      </section>

      <section className="mt-6 rounded-lg border border-white/10 bg-white/5 p-4">
        <h2 className="text-xl font-semibold">Rhythm Trainer</h2>
        <p className="text-white/70 mt-2">Coming soon.</p>
      </section>

      <section className="mt-6 rounded-lg border border-white/10 bg-white/5 p-4">
        <h2 className="text-xl font-semibold">Sound Library</h2>
        <ul className="list-disc pl-6 mt-2 text-white/80">
          {samples.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}
