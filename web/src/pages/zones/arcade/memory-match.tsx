import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";

type Difficulty = "easy" | "medium" | "hard";
const DIFF_SPECS: Record<Difficulty, { cols: number; rows: number; label: string }> = {
  easy: { cols: 4, rows: 4, label: "Easy (4×4)" },
  medium: { cols: 6, rows: 6, label: "Medium (6×6)" },
  hard: { cols: 8, rows: 6, label: "Hard (8×6)" },
};

// 24+ nature icons so we can cover hard (24 pairs).
const ICONS = ["🌿","🌸","🍄","🌻","🐝","🦋","🪺","🦊","🦉","🦔","🐢","🐸","🐟","🐬","🪼","🦀","🦑","🦞","🌊","⛰️","🌋","🌙","⭐","☀️","🌈","🍁","🍃","🥥","🥭","🍍"];

type Card = { id: number; icon: string; matched: boolean };

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const key = (k: string) => `nv:${k}`;

export default function MemoryMatch() {
  const [difficulty, setDifficulty] = useState<Difficulty>(() => (localStorage.getItem(key("mm:lastDiff")) as Difficulty) || "easy");
  const spec = DIFF_SPECS[difficulty];
  const pairCount = (spec.cols * spec.rows) / 2;

  const deck = useMemo<Card[]>(() => {
    const icons = ICONS.slice(0, pairCount);
    const pairs = icons.flatMap((icon, i) => [
      { id: i * 2, icon, matched: false },
      { id: i * 2 + 1, icon, matched: false },
    ]);
    return shuffle(pairs);
  }, [pairCount, difficulty]);

  const [cards, setCards] = useState<Card[]>(deck);
  useEffect(() => setCards(deck), [deck]);

  const [first, setFirst] = useState<number | null>(null);
  const [second, setSecond] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const [started, setStarted] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const bestKey = key(`mm:best:${difficulty}`);
  const best = Number(localStorage.getItem(bestKey) || 0);

  // timer
  const tickRef = useRef<number | null>(null);
  useEffect(() => {
    if (!started || showModal) return;
    tickRef.current = window.setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => { if (tickRef.current) window.clearInterval(tickRef.current); };
  }, [started, showModal]);

  function flip(idx: number) {
    if (showModal) return;
    if (!started) setStarted(true);
    if (idx === first || idx === second) return;

    if (first === null) {
      setFirst(idx);
      return;
    }
    if (second === null) {
      setSecond(idx);
      setMoves((m) => m + 1);
    }
  }

  // match logic
  useEffect(() => {
    if (first === null || second === null) return;
    const a = cards[first], b = cards[second];
    if (a.icon === b.icon) {
      setCards((cs) => {
        const n = cs.slice();
        n[first] = { ...a, matched: true };
        n[second] = { ...b, matched: true };
        return n;
      });
      setFirst(null); setSecond(null);
    } else {
      const t = setTimeout(() => { setFirst(null); setSecond(null); }, 650);
      return () => clearTimeout(t);
    }
  }, [first, second, cards]);

  // completion check
  useEffect(() => {
    if (cards.length && cards.every((c) => c.matched)) {
      if (tickRef.current) window.clearInterval(tickRef.current);
      // update best (lower time is better; tie-breaker: fewer moves)
      const currentScore = elapsed || 1;
      const prev = Number(localStorage.getItem(bestKey) || 0);
      if (!prev || currentScore < prev) localStorage.setItem(bestKey, String(currentScore));

      // coins: simple reward proportional to difficulty and quickness
      const base = difficulty === "easy" ? 3 : difficulty === "medium" ? 6 : 10;
      const speed = Math.max(1, Math.round((pairCount * 3) / Math.max(1, currentScore)));
      const coins = base + speed;
      const total = Number(localStorage.getItem(key("coins")) || 0) + coins;
      localStorage.setItem(key("coins"), String(total));

      setShowModal(true);
    }
  }, [cards, elapsed, bestKey, difficulty, pairCount]);

  function restart(newDiff?: Difficulty) {
    if (newDiff) {
      setDifficulty(newDiff);
      localStorage.setItem(key("mm:lastDiff"), newDiff);
    }
    setFirst(null); setSecond(null); setMoves(0); setElapsed(0); setStarted(false); setShowModal(false);
    // force re-deal by toggling difficulty (already handled by effect via pairCount)
  }

  // derived helpers
  const colsStyle = { gridTemplateColumns: `repeat(${spec.cols}, minmax(44px, 1fr))` };

  return (
    <div className="wrap">
      <style>{CSS}</style>
      <div className="top">
        <h1>🧠 Memory Match</h1>
        <Link className="back" to="/zones/arcade">← Back to Arcade</Link>
      </div>

      <div className="toolbar">
        <label>
          Level:&nbsp;
          <select
            value={difficulty}
            onChange={(e) => restart(e.target.value as Difficulty)}
          >
            {Object.entries(DIFF_SPECS).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
        </label>
        <button className="ghost" onClick={() => restart()}>Restart</button>
      </div>

      <div className="hud">
        <span>⏱️ Time: <b>{format(elapsed)}</b></span>
        <span>🌀 Moves: <b>{moves}</b></span>
        <span title="Best time for this level">🏆 Best: <b>{best ? format(best) : "—"}</b></span>
        <Coins />
      </div>

      <div className="grid" style={colsStyle} aria-label="card grid">
        {cards.map((c, idx) => {
          const flipped = c.matched || idx === first || idx === second;
          return (
            <button
              key={c.id}
              className={`card ${flipped ? "flipped" : ""} ${c.matched ? "matched" : ""}`}
              onClick={() => flip(idx)}
              disabled={flipped}
              aria-label={flipped ? c.icon : "Hidden card"}
            >
              <span className="front">?</span>
              <span className="back">{c.icon}</span>
            </button>
          );
        })}
      </div>

      {showModal && (
        <div className="modal">
          <div className="panel">
            <h2>Nice work! 🌟</h2>
            <p>You finished <b>{DIFF_SPECS[difficulty].label}</b> in <b>{format(elapsed)}</b> with <b>{moves}</b> moves.</p>
            <p>🏆 Best: <b>{best ? format(Math.min(best, elapsed)) : format(elapsed)}</b></p>
            <div className="actions">
              <button onClick={() => { setShowModal(false); restart(); }}>Play again</button>
              <Link className="ghost" to="/zones/arcade">Back to Arcade</Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Coins() {
  const [coins, setCoins] = useState<number>(() => Number(localStorage.getItem(key("coins")) || 0));
  useEffect(() => {
    const t = setInterval(() => setCoins(Number(localStorage.getItem(key("coins")) || 0)), 600);
    return () => clearInterval(t);
  }, []);
  return <span>🪙 Coins: <b>{coins}</b></span>;
}

function format(sec: number) {
  const m = Math.floor(sec / 60).toString().padStart(2, "0");
  const s = Math.floor(sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

const CSS = `
.wrap { max-width: 980px; margin: 0 auto; padding: 1.25rem; color: #eaf2ff; }
.top { display:flex; align-items:center; gap:1rem; justify-content:space-between; }
.back { opacity:.9; }
.toolbar { display:flex; gap:.75rem; align-items:center; margin:.5rem 0 1rem; }
.hud { display:flex; gap:1.25rem; align-items:center; margin-bottom:.75rem; flex-wrap:wrap; }
.ghost { background: transparent; border: 1px solid #6aa8ff88; color: #eaf2ff; padding:.4rem .7rem; border-radius:8px; }
.grid {
  display:grid; gap:.6rem; margin-top:.5rem;
  --card: #24344b; --card2:#2f3e57; --glow: #7ecbff55;
}
.card {
  position:relative; aspect-ratio: 1/1; border:0; border-radius:14px;
  background: linear-gradient(180deg, var(--card), var(--card2));
  box-shadow: 0 0 0 1px #00000033 inset, 0 6px 16px #00000033;
  font-size: clamp(18px, 3.1vw, 32px);
  color:#eaf2ff; cursor:pointer; transform-style:preserve-3d;
  transition: transform .25s ease, box-shadow .25s ease, background .25s;
}
.card:focus-visible { outline: 2px solid #91f2ff; }
.card.flipped, .card.matched { transform: rotateY(180deg); }
.card.matched { box-shadow: 0 0 0 1px #4ff0a455 inset, 0 10px 22px #2de3a433; }
.card .front, .card .back {
  position:absolute; inset:0; display:grid; place-items:center; border-radius:inherit;
  backface-visibility: hidden;
}
.card .front { content:'?'; font-weight:700; letter-spacing:.02em; text-shadow: 0 1px 0 #0008; }
.card .back { transform: rotateY(180deg); font-size:1.6em; }
.modal {
  position:fixed; inset:0; display:grid; place-items:center; background:#0009; z-index:50;
}
.panel {
  background: #0d1420f0; border:1px solid #436a9a88; padding:1rem 1.25rem; border-radius:14px;
  box-shadow: 0 18px 48px #00000088;
}
.actions { display:flex; gap:.75rem; justify-content:flex-end; margin-top:.75rem; }
.actions a, .actions button {
  padding:.5rem .85rem; border-radius:10px; border:0; color:#0b1220; background:#91f2ff;
}
.actions .ghost { background:transparent; border: 1px solid #6aa8ff88; color: #eaf2ff; }
@media (max-width: 560px) {
  .wrap { padding: .75rem; }
  .card { font-size: clamp(16px, 6vw, 24px); }
}
`;
