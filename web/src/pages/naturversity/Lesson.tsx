import React, { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { naturversityUnits } from '../../content/naturversity';
import { isComplete, toggleComplete } from '../../lib/progress';

export default function Lesson() {
  const { id = "" } = useParams();
  const nav = useNavigate();

  const allLessons = useMemo(() => naturversityUnits.flatMap(u => u.lessons), []);
  const idx = allLessons.findIndex(l => l.id === id);
  const lesson = allLessons[idx];

  const [done, setDone] = useState(() => (lesson ? isComplete(lesson.id) : false));

  if (!lesson) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10 text-white">
        <p>Lesson not found.</p>
        <Link className="underline text-sky-300" to="/zones/naturversity">Back to Naturversity</Link>
      </main>
    );
    }

  const next = allLessons[idx + 1]?.id;

  const handleToggle = () => {
    toggleComplete(lesson.id, !done);
    setDone(!done);
  };

  const handleNext = () => {
    if (next) nav(`/naturversity/lesson/${next}`);
    else nav("/zones/naturversity");
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 text-white">
      <Link className="underline text-sky-300" to="/zones/naturversity">← Back</Link>
      <h1 className="text-3xl font-bold mt-3">{lesson.title}</h1>
      <div className="text-white/70 mt-1">{lesson.kind} • {lesson.duration}</div>

      <article className="mt-6 whitespace-pre-wrap text-lg leading-relaxed">
        {lesson.body}
      </article>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <button
          onClick={handleToggle}
          className={`rounded-md px-4 py-2 font-medium ${
            done ? "bg-emerald-600 text-white" : "bg-white/10 text-white hover:bg-white/20"
          }`}
        >
          {done ? "Completed ✓" : "Mark complete"}
        </button>

        <button
          onClick={handleNext}
          className="rounded-md px-4 py-2 font-medium bg-sky-600 text-white hover:bg-sky-500"
        >
          {next ? "Next lesson →" : "Finish unit"}
        </button>
      </div>
    </main>
  );
}
