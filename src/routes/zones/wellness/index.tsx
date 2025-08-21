import { useEffect, useRef, useState } from "react";
import "../../../styles/zone-widgets.css";

export default function Wellness() {
  return (
    <main className="container">
      <div className="breadcrumb">Home / Zones / Wellness</div>
      <h2 className="section-title">Wellness</h2>
      <p className="section-lead">Yoga, breathing, stretches, mindful quests (client-only).</p>

      <div className="wellness-grid">
        <section className="zone-card">
          <div className="zone-title">🌬️ Breath Coach</div>
          <div className="zone-sub">Box / 4-7-8 / Custom with visual timing.</div>
          <BreathCoach />
        </section>

        <section className="zone-card">
          <div className="zone-title">🧘 Stretch Flow</div>
          <div className="zone-sub">Guided 7-pose routine with timers.</div>
          <StretchFlow />
        </section>
      </div>

      <section className="zone-card">
        <div className="zone-title">⏱️ Interval Timer</div>
        <div className="zone-sub">Set work/rest for calisthenics or yoga holds.</div>
        <Intervals />
      </section>

      <section className="zone-card">
        <div className="zone-title">🗺️ Coming Soon</div>
        <div className="zone-sub">Guided Tai Chi, posture coach, streaks & quests.</div>
      </section>
    </main>
  );
}

/* ---------------- Breath Coach ---------------- */
type Pattern = { name: string; phases: { label: string; secs: number }[] };

const PATTERNS: Pattern[] = [
  { name: "Box 4•4•4•4", phases: [
    { label: "Inhale", secs: 4 }, { label: "Hold", secs: 4 },
    { label: "Exhale", secs: 4 }, { label: "Hold", secs: 4 },
  ]},
  { name: "4-7-8", phases: [
    { label: "Inhale", secs: 4 }, { label: "Hold", secs: 7 }, { label: "Exhale", secs: 8 },
  ]},
];

function BreathCoach() {
  const [pattern, setPattern] = useState<Pattern>(PATTERNS[0]);
  const [custom, setCustom] = useState("5,5,5,5"); // comma seconds
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState(0);
  const [t, setT] = useState(0); // seconds into phase
  const tickRef = useRef<number | null>(null);

  const active = pattern.phases[phase] ?? { label: "", secs: 1 };
  const pct = Math.min(100, Math.round((t / active.secs) * 100));

  useEffect(() => {
    if (!running) return;
    tickRef.current = window.setInterval(() => setT(v => v + 0.1), 100);
    return () => { if (tickRef.current) clearInterval(tickRef.current); };
  }, [running, phase]);

  useEffect(() => {
    if (!running) return;
    if (t >= active.secs) {
      setT(0);
      setPhase(p => (p + 1) % pattern.phases.length);
    }
  }, [t, running, active.secs, pattern.phases.length]);

  const start = () => { setT(0); setPhase(0); setRunning(true); };
  const stop = () => { setRunning(false); setT(0); };

  const loadCustom = () => {
    const parts = custom.split(",").map(s => Math.max(1, parseInt(s.trim() || "0")));
    if (parts.length >= 2) {
      setPattern({ name: "Custom", phases: parts.map((n, i) => ({ label: ["Inhale","Hold","Exhale","Hold"][i % 4], secs: n })) });
      setPhase(0); setT(0);
    }
  };

  return (
    <div className="widget">
      <div className="kit">
        <select onChange={(e) => setPattern(PATTERNS[parseInt(e.target.value)])} disabled={running}>
          {PATTERNS.map((p, i) => <option key={p.name} value={i}>{p.name}</option>)}
        </select>
        <span className="badge">or Custom</span>
        <input
          aria-label="Custom pattern seconds"
          placeholder="e.g. 5,5,5,5"
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          disabled={running}
        />
        <button onClick={loadCustom} disabled={running}>Load</button>
      </div>

      <div style={{ marginTop: 10 }}>
        <div className="small">Phase: <b>{active.label}</b> • {active.secs - Math.floor(t)}s</div>
        <div className="progress" aria-hidden>
          <span style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div className="counter">
        <button onClick={running ? stop : start}>{running ? "Stop" : "Start"}</button>
        <div className="timer-pill">{pattern.name}</div>
        <div className="small">Cycles endlessly</div>
      </div>
    </div>
  );
}

/* ---------------- Stretch Flow ---------------- */
type Step = { icon: string; name: string; seconds: number; note?: string };

const BASE_FLOW: Step[] = [
  { icon: "🧍", name: "Neck circles", seconds: 20 },
  { icon: "🧎", name: "Cat–Cow", seconds: 30 },
  { icon: "🧘", name: "Seated fold", seconds: 30 },
  { icon: "🦵", name: "Quad stretch (R)", seconds: 25 },
  { icon: "🦵", name: "Quad stretch (L)", seconds: 25 },
  { icon: "🦶", name: "Calf stretch (wall)", seconds: 25 },
  { icon: "🧘‍♂️", name: "Child’s pose", seconds: 40, note: "Breathe into back" },
];

function StretchFlow() {
  const [i, setI] = useState(0);
  const [left, setLeft] = useState(BASE_FLOW[0].seconds);
  const [running, setRunning] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (!running) return;
    timer.current = window.setInterval(() => setLeft(v => Math.max(0, v - 1)), 1000);
    return () => { if (timer.current) clearInterval(timer.current); };
  }, [running, i]);

  useEffect(() => {
    if (!running) return;
    if (left === 0) {
      const next = (i + 1) % BASE_FLOW.length;
      setI(next);
      setLeft(BASE_FLOW[next].seconds);
    }
  }, [left, i, running]);

  const reset = () => { setI(0); setLeft(BASE_FLOW[0].seconds); setRunning(false); };

  const step = BASE_FLOW[i];
  const pct = Math.round(((step.seconds - left) / step.seconds) * 100);

  return (
    <div className="widget">
      <div className={`flow-step ${running ? "active" : ""}`}>
        <div>
          <div style={{ fontWeight: 700 }}>{step.icon} {step.name}</div>
          <div className="small">{step.note || "Good form, gentle breaths."}</div>
        </div>
        <div className="timer-pill"><b>{left}s</b></div>
      </div>

      <div className="progress" style={{ marginTop: 10 }}>
        <span style={{ width: `${pct}%` }} />
      </div>

      <div className="counter">
        <button onClick={() => setRunning(v => !v)}>{running ? "Pause" : "Start"}</button>
        <button onClick={reset}>Reset</button>
        <div className="small">Step {i + 1} / {BASE_FLOW.length}</div>
      </div>

      <div className="flow-list" style={{ marginTop: 12 }}>
        {BASE_FLOW.map((s, idx) => (
          <div key={idx} className={`flow-step ${idx === i ? "active" : ""}`}
               onClick={() => { setI(idx); setLeft(s.seconds); }}>
            <div>{s.icon} {s.name}</div>
            <div className="small">{s.seconds}s</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Intervals ---------------- */
function Intervals() {
  const [work, setWork] = useState(30);
  const [rest, setRest] = useState(15);
  const [rounds, setRounds] = useState(6);
  const [state, setState] = useState<"idle" | "work" | "rest" | "done">("idle");
  const [left, setLeft] = useState(0);
  const [round, setRound] = useState(0);
  const tRef = useRef<number | null>(null);

  useEffect(() => {
    if (state === "idle" || state === "done") return;
    tRef.current = window.setInterval(() => setLeft(v => Math.max(0, v - 1)), 1000);
    return () => { if (tRef.current) clearInterval(tRef.current); };
  }, [state]);

  useEffect(() => {
    if (left !== 0) return;
    if (state === "idle") return;
    if (state === "work") {
      setState("rest"); setLeft(rest);
    } else if (state === "rest") {
      const nextRound = round + 1;
      if (nextRound >= rounds) { setState("done"); }
      else { setRound(nextRound); setState("work"); setLeft(work); }
    }
  }, [left, rest, work, rounds, round, state]);

  const start = () => { setRound(0); setState("work"); setLeft(work); };
  const stop = () => { setState("idle"); setLeft(0); };

  const label = state === "work" ? "Work"
    : state === "rest" ? "Rest"
    : state === "done" ? "Done"
    : "Ready";

  const total = state === "work" ? work : state === "rest" ? rest : 1;
  const pct = Math.round(((total - left) / total) * 100);

  return (
    <div className="widget">
      <div className="kit">
        <label>Work (s)<input type="number" min={5} value={work} onChange={e => setWork(parseInt(e.target.value||"0"))} /></label>
        <label>Rest (s)<input type="number" min={5} value={rest} onChange={e => setRest(parseInt(e.target.value||"0"))} /></label>
        <label>Rounds<input type="number" min={1} value={rounds} onChange={e => setRounds(parseInt(e.target.value||"0"))} /></label>
      </div>

      <div className="flow-step" style={{ marginTop: 10 }}>
        <div><b>{label}</b> — round {Math.min(round + 1, rounds)} / {rounds}</div>
        <div className="timer-pill"><b>{left}s</b></div>
      </div>
      <div className="progress" style={{ marginTop: 10 }}>
        <span style={{ width: `${pct}%` }} />
      </div>

      <div className="counter">
        <button onClick={state === "idle" || state === "done" ? start : stop}>
          {state === "idle" || state === "done" ? "Start" : "Stop"}
        </button>
        <div className="small">Great for EMOM/AMRAP holds & calisthenics.</div>
      </div>
    </div>
  );
}
