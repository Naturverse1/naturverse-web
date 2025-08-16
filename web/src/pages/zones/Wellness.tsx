import React, { useEffect, useState } from "react";

export default function WellnessZone() {
  const [mood, setMood] = useState<string>("");
  const [breath, setBreath] = useState<number>(0);

  useEffect(() => {
    let id: any;
    if (breath > 0) {
      id = setInterval(() => setBreath((n) => (n > 1 ? n - 1 : 0)), 1000);
    }
    return () => clearInterval(id);
  }, [breath]);

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 text-white">
      <h1 className="text-3xl font-bold">Wellness Zone</h1>
      <p className="text-white/80 mt-2">Tiny tools to reset your day.</p>

      <section className="mt-6 rounded-lg border border-white/10 bg-white/5 p-4">
        <h2 className="text-xl font-semibold">Daily Check-in</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {["😀", "🙂", "😐", "😕", "😴"].map((m) => (
            <button
              key={m}
              onClick={() => setMood(m)}
              className={`text-2xl rounded-md px-3 py-2 ${mood === m ? "bg-emerald-600/80" : "bg-white/10"}`}
            >
              {m}
            </button>
          ))}
        </div>
        {mood && <p className="mt-3 text-white/80">Logged mood: {mood}</p>}
      </section>

      <section className="mt-6 rounded-lg border border-white/10 bg-white/5 p-4">
        <h2 className="text-xl font-semibold">Breath Timer</h2>
        <p className="text-white/70 mt-1">Press start and breathe in/out slowly for {breath || 0} seconds.</p>
        <div className="mt-3 flex gap-2">
          {[30, 60, 90].map((s) => (
            <button key={s} onClick={() => setBreath(s)} className="rounded-md bg-sky-600 px-3 py-2">
              Start {s}s
            </button>
          ))}
          <button onClick={() => setBreath(0)} className="rounded-md bg-white/10 px-3 py-2">
            Stop
          </button>
        </div>
      </section>
    </main>
  );
}
