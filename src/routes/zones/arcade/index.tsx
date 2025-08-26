import { useEffect, useRef, useState } from "react";
import Breadcrumbs from "../../../components/Breadcrumbs";
import Leaderboard from "../../../components/Leaderboard";
import { postScore, autoGrantOncePerDay } from "@/lib/rewards";
import { toast } from "@/components/Toaster";
import "../../../styles/zone-widgets.css";

export default function Arcade() {
  return (
    <main className="container">
      <Breadcrumbs />
      <h2 className="section-title">Arcade</h2>
      <p className="section-lead">Mini-games, leaderboards &amp; tournaments.</p>

      <div className="zone-wrap">
        <section className="zone-card">
          <div className="zone-title">⚡ Reaction Timer</div>
          <div className="zone-sub">Wait for green, then tap as fast as you can. Best of 5.</div>
          <ReactionTimer />
          <Leaderboard game="reaction_timer" />
        </section>

        <section className="zone-card">
          <div className="zone-title">🎯 Bubble Popper</div>
          <div className="zone-sub">Pop as many bubbles as possible in 20 seconds.</div>
          <BubblePopper />
        </section>
      </div>
    </main>
  );
}

/* ---------- Reaction Timer ---------- */
function ReactionTimer() {
  type Phase = "idle" | "wait" | "go" | "tooSoon" | "done";
  const [phase, setPhase] = useState<Phase>("idle");
  const [results, setResults] = useState<number[]>([]);
  const startAt = useRef<number>(0);
  const timer = useRef<number | null>(null);

  const startRound = () => {
    setPhase("wait");
    const delay = 800 + Math.random() * 1800;
    timer.current = window.setTimeout(() => {
      startAt.current = performance.now();
      setPhase("go");
    }, delay);
  };

  const stop = () => {
    if (phase === "wait") {
      if (timer.current) window.clearTimeout(timer.current);
      setPhase("tooSoon");
      return;
    }
    if (phase === "go") {
      const ms = Math.round(performance.now() - startAt.current);
      const next = [...results, ms];
      setResults(next);
      try {
        postScore('reaction_timer', ms * -1);
        autoGrantOncePerDay('Thailandia').then((granted) => granted && toast('Stamp earned!'));
      } catch {}
      if (next.length >= 5) setPhase("done");
      else startRound();
    }
  };

  const reset = () => {
    if (timer.current) window.clearTimeout(timer.current);
    setResults([]);
    setPhase("idle");
  };

  const avg = results.length
    ? Math.round(results.reduce((a, b) => a + b, 0) / results.length)
    : null;

  return (
    <div className="widget">
      {phase === "idle" && (
        <>
          <p>Tap to begin a round.</p>
          <button onClick={startRound}>Start</button>
        </>
      )}

      {phase === "wait" && (
        <div className="rt-stage rt-wait" onClick={stop}>
          <b>Wait for green…</b>
        </div>
      )}
      {phase === "go" && (
        <div className="rt-stage rt-go" onClick={stop}>
          <b>Tap!</b>
        </div>
      )}
      {phase === "tooSoon" && (
        <>
          <div className="rt-stage rt-too"><b>Too soon!</b></div>
          <button onClick={startRound}>Try again</button>
        </>
      )}
      {phase === "done" && (
        <>
          <p><b>Results:</b> {results.join(" ms, ")} ms</p>
          <p><b>Average:</b> {avg} ms</p>
          <button onClick={reset}>Reset</button>
        </>
      )}
      {results.length > 0 && phase !== "done" && (
        <p style={{ marginTop: 8 }}>
          Round {results.length + 1} of 5 • Last: {results[results.length - 1]} ms
        </p>
      )}
    </div>
  );
}

/* ---------- Bubble Popper ---------- */
function BubblePopper() {
  const [running, setRunning] = useState(false);
  const [hits, setHits] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const stageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setTimeLeft(tl => (tl > 0 ? tl - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [running]);

  useEffect(() => {
    if (running && timeLeft === 0) setRunning(false);
  }, [running, timeLeft]);

  const spawnBubble = () => {
    const stage = stageRef.current;
    if (!stage) return;
    const b = document.createElement("div");
    b.className = "bubble";
    b.textContent = "•";
    const rect = stage.getBoundingClientRect();
    const x = Math.random() * (rect.width - 34);
    const y = Math.random() * (rect.height - 34);
    b.style.left = `${x}px`;
    b.style.top = `${y}px`;
    const kill = () => {
      setHits(h => h + 1);
      b.remove();
    };
    b.addEventListener("click", kill, { once: true });
    stage.appendChild(b);
    window.setTimeout(() => b.remove(), 1200);
  };

  useInterval(() => {
    if (running) spawnBubble();
  }, 450);

  const start = () => {
    setHits(0);
    setTimeLeft(20);
    setRunning(true);
  };

  return (
    <div className="widget">
      <div className="popper-stage" ref={stageRef} aria-label="Bubble popper playfield" />
      <div className="stats">
        <div>⏱️ Time: {timeLeft}s</div>
        <div>🎯 Hits: {hits}</div>
      </div>
      <div style={{ marginTop: 10 }}>
        <button onClick={start} disabled={running}>{running ? "Playing…" : "Start (20s)"}</button>
      </div>
    </div>
  );
}

/* small interval hook */
function useInterval(fn: () => void, ms: number) {
  const saved = useRef(fn);
  useEffect(() => { saved.current = fn; }, [fn]);
  useEffect(() => {
    const id = window.setInterval(() => saved.current(), ms);
    return () => window.clearInterval(id);
  }, [ms]);
}
