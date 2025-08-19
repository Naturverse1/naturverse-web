import React, { useEffect, useRef, useState } from "react";

function BreathCircle({ phase }: { phase: "in"|"hold"|"out"|"ready" }) {
  const sizes: Record<typeof phase, number> = { ready: 60, in: 100, hold: 100, out: 60 };
  return (
    <div style={{
      width: sizes[phase], height: sizes[phase], transition:"all .9s ease",
      borderRadius:"50%", background:"#e9f7ef", border:"1px solid #d0e8db",
      display:"grid", placeItems:"center", fontWeight:600
    }}>
      {phase === "in" ? "Inhale" : phase === "out" ? "Exhale" : phase === "hold" ? "Hold" : "Ready"}
    </div>
  );
}

export default function Wellness() {
  const [phase, setPhase] = useState<"ready"|"in"|"hold"|"out">("ready");
  const timer = useRef<number | null>(null);

  function start() {
    let seq: ("in"|"hold"|"out")[] = ["in","hold","out"];
    let i = 0;
    setPhase("in");
    timer.current = window.setInterval(() => {
      i = (i + 1) % seq.length;
      setPhase(seq[i]);
    }, 4000);
  }
  function stop() {
    if (timer.current) window.clearInterval(timer.current);
    setPhase("ready");
  }
  useEffect(() => () => { if (timer.current) window.clearInterval(timer.current); }, []);

  return (
    <section>
      <h1>🧘 Wellness</h1>
      <p>Quick breathing exercise (4s inhale → 4s hold → 4s exhale).</p>
      <div style={{ display:"flex", alignItems:"center", gap:16, marginTop:16 }}>
        <BreathCircle phase={phase} />
        <div>
          <button onClick={start}>Start</button>
          <button onClick={stop} style={{ marginLeft:8 }}>Stop</button>
        </div>
      </div>
    </section>
  );
}

