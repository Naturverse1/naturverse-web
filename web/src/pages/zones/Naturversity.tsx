import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { naturversityUnits } from "@/content/naturversity";
import { getProgress } from "@/lib/db";

export default function Naturversity() {
  const [progressMap, setProgressMap] = useState<Record<string, string>>({});
  const zone = "naturversity";

  useEffect(() => {
    (async () => {
      try {
        const rows = await getProgress(zone);
        const map: Record<string, string> = {};
        rows.forEach((r) => {
          map[r.unit] = r.status;
        });
        setProgressMap(map);
      } catch {
        // not signed in or first time; leave map empty
      }
    })();
  }, []);

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 text-white">
      <h1 className="text-3xl font-bold">Naturversity</h1>
      <p className="text-white/80 mt-2">
        Guided lessons, quests, and projects. Progress saves when you’re signed in.
      </p>

      <div className="mt-8 space-y-6">
        {naturversityUnits.map((u) => {
          const done = progressMap[u.id] === "complete"; // simple unit-level flag
          return (
            <section key={u.id} className="rounded-lg border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-2xl font-semibold">
                  {u.title} {done ? "✅" : ""}
                </h2>
              </div>
              <ul className="mt-3 divide-y divide-white/10">
                {u.lessons.map((l) => (
                  <li key={l.id} className="py-3">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <Link
                          to={`/naturversity/lesson/${l.id}`}
                          className="text-sky-300 hover:text-sky-200 underline"
                        >
                          {l.title}
                        </Link>
                        <div className="text-white/70 text-sm">{l.summary}</div>
                      </div>
                      <span className="text-white/60 text-sm">{l.duration}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </main>
  );
}
