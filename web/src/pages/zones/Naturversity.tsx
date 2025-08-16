import React from "react";
import { Link } from "react-router-dom";
import { naturversityUnits } from "@/content/naturversity";
import { countCompleted } from "@/lib/progress";
import ProgressBadge from "@/components/ProgressBadge";

export default function Naturversity() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10 text-white">
      <h1 className="text-3xl font-bold">Naturversity</h1>
      <p className="text-white/80 mt-2">
        Guided lessons, quests, and projects. Your progress is saved on this device.
      </p>

      <div className="mt-8 space-y-6">
        {naturversityUnits.map((u) => {
          const lessonIds = u.lessons.map(l => l.id);
          const done = countCompleted(lessonIds);
          return (
            <section key={u.id} className="rounded-lg border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-2xl font-semibold">{u.title}</h2>
                <ProgressBadge done={done} total={lessonIds.length} />
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
