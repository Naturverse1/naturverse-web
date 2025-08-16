import React, { useEffect, useState } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";

const checklist = ["Sample soil", "Measure rainfall", "Sketch a leaf"];

export default function EcoLab() {
  const [observation, setObservation] = useState(() => localStorage.getItem("ecoLabObservation") || "");
  const [progress, setProgress] = useState<boolean[]>(() => {
    const raw = localStorage.getItem("ecoLabProgress");
    return raw ? JSON.parse(raw) : [false, false, false];
  });

  useEffect(() => {
    localStorage.setItem("ecoLabProgress", JSON.stringify(progress));
  }, [progress]);

  function saveObservation() {
    localStorage.setItem("ecoLabObservation", observation);
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 text-white">
      <Breadcrumbs
        items={[
          { label: "Naturverse" },
          { label: "Home", to: "/" },
          { label: "Zones", to: "/zones" },
          { label: "Eco Lab" }
        ]}
      />
      <h1 className="text-3xl font-bold">Eco Lab</h1>
      <p className="text-white/80 mt-2">Hands-on mini experiments and nature observations.</p>

      <section className="mt-6 rounded-lg border border-white/10 bg-white/5 p-4">
        <h2 className="text-xl font-semibold">Today’s Observation</h2>
        <textarea
          className="mt-3 w-full rounded bg-white/10 p-2"
          rows={3}
          value={observation}
          onChange={(e) => setObservation(e.target.value)}
        />
        <button onClick={saveObservation} className="mt-3 rounded-md bg-sky-600 px-4 py-2">
          Save
        </button>
      </section>

      <section className="mt-6 rounded-lg border border-white/10 bg-white/5 p-4">
        <h2 className="text-xl font-semibold">Mini-Experiment Ideas</h2>
        <ul className="list-disc pl-6 mt-2 text-white/80">
          <li>seed sprout jar</li>
          <li>capillary celery</li>
          <li>leaf print</li>
          <li>soil sieve</li>
        </ul>
      </section>

      <section className="mt-6 rounded-lg border border-white/10 bg-white/5 p-4">
        <h2 className="text-xl font-semibold">Field Notes</h2>
        <ul className="mt-2 space-y-2 text-white/80">
          {checklist.map((item, i) => (
            <li key={item} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={progress[i]}
                onChange={(e) => {
                  const next = [...progress];
                  next[i] = e.target.checked;
                  setProgress(next);
                }}
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
