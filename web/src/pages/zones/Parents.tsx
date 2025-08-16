import React from "react";
import { Breadcrumbs } from '../../components/Breadcrumbs';

export default function Parents() {
  function exportProgress() {
    const keys = [
      "naturversityProgress",
      "wellnessTimers",
      "ecoLabProgress",
      "storyStudioDrafts"
    ];
    const data: Record<string, unknown> = {};
    keys.forEach((k) => {
      const v = localStorage.getItem(k);
      if (v) data[k] = JSON.parse(v);
    });
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "naturverse-progress.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 text-white">
      <Breadcrumbs
        items={[
          { label: "Naturverse" },
          { label: "Home", to: "/" },
          { label: "Zones", to: "/zones" },
          { label: "Parents & Teachers" }
        ]}
      />
      <h1 className="text-3xl font-bold">Parents & Teachers</h1>
      <p className="text-white/80 mt-2">Tips, progress exporting, and classroom ideas.</p>

      <section className="mt-6 rounded-lg border border-white/10 bg-white/5 p-4">
        <h2 className="text-xl font-semibold">Overview</h2>
        <p className="text-white/80 mt-2">
          Naturverse blends exploration and learning. Use zones to encourage curiosity
          and track progress.
        </p>
      </section>

      <section className="mt-6 rounded-lg border border-white/10 bg-white/5 p-4">
        <h2 className="text-xl font-semibold">Export Progress</h2>
        <button onClick={exportProgress} className="mt-3 rounded-md bg-sky-600 px-4 py-2">
          Download JSON
        </button>
      </section>

      <section className="mt-6 rounded-lg border border-white/10 bg-white/5 p-4">
        <h2 className="text-xl font-semibold">Classroom Ideas</h2>
        <ul className="list-disc pl-6 mt-2 text-white/80">
          <li>Nature journaling challenge</li>
          <li>Group story circle</li>
          <li>Recycling project</li>
        </ul>
      </section>
    </main>
  );
}
