import React, { useState } from "react";

type Track = { id: string; title: string; artist: string; src?: string };
const playlists: Record<string, Track[]> = {
  focus: [
    { id: "f1", title: "Morning Mist", artist: "Naturverse", src: "" },
    { id: "f2", title: "Soft Pines", artist: "Naturverse", src: "" },
  ],
  chill: [
    { id: "c1", title: "Star Glow", artist: "Naturverse", src: "" },
    { id: "c2", title: "Moon Drift", artist: "Naturverse", src: "" },
  ],
};

export default function MusicZone() {
  const [tab, setTab] = useState<"focus" | "chill">("focus");
  const list = playlists[tab];

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 text-white">
      <h1 className="text-3xl font-bold">Music Zone</h1>
      <p className="text-white/80 mt-2">Mood playlists for study and play. (Audio hookup comes next.)</p>

      <div className="mt-6 flex gap-3">
        <button
          className={`rounded-md px-4 py-2 ${tab === "focus" ? "bg-sky-600" : "bg-white/10"} `}
          onClick={() => setTab("focus")}
        >
          Focus
        </button>
        <button
          className={`rounded-md px-4 py-2 ${tab === "chill" ? "bg-sky-600" : "bg-white/10"} `}
          onClick={() => setTab("chill")}
        >
          Chill
        </button>
      </div>

      <ul className="mt-6 divide-y divide-white/10 rounded-lg border border-white/10 bg-white/5">
        {list.map((t) => (
          <li key={t.id} className="p-4 flex items-center justify-between">
            <div>
              <div className="font-medium">{t.title}</div>
              <div className="text-white/70 text-sm">{t.artist}</div>
            </div>
            <button className="rounded-md bg-white/10 px-3 py-1">Play ▶</button>
          </li>
        ))}
      </ul>
    </main>
  );
}
