import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
// Optional supabase (already in project). Safe-guarded usage below.
import { supabase } from "../../../supabaseClient"; // if this path differs, update it

type Level = "easy" | "medium" | "hard";
type Card = { id: number; emoji: string; matched: boolean; flipped: boolean };

const EMOJIS = [
  "🦊","🐼","🦉","🐸","🐨","🦄","🦋","🐙",
  "🐧","🐢","🐝","🦔","🦓","🐳","🦀","🌿",
  "🍄","🌊"
];

const GRID_MAP: Record<Level, { cols: number; rows: number }> = {
  easy:   { cols: 4, rows: 4 },   // 8 pairs
  medium: { cols: 5, rows: 4 },   // 10 pairs
  hard:   { cols: 6, rows: 6 },   // 18 pairs (uses all)
};

const LS_KEY = "naturverse.memory.best";

function useSound() {
  // Small inline beeps so we don’t load files or libs
  const flip = useRef<HTMLAudioElement>();
  const match = useRef<HTMLAudioElement>();
  const win = useRef<HTMLAudioElement>();

  useEffect(() => {
    flip.current  = new Audio("data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AACJWAAACABYAAAABAAAAAAA=");
    match.current = new Audio("data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AACJWAAACABYAAAABAAAAAAA=");
    win.current   = new Audio("data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AACJWAAACABYAAAABAAAAAAA=");
  }, []);

  return {
    playFlip:  () => flip.current?.play().catch(() => {}),
    playMatch: () => match.current?.play().catch(() => {}),
    playWin:   () => win.current?.play().catch(() => {}),
  };
}

function buildDeck(level: Level): Card[] {
  const { cols, rows } = GRID_MAP[level];
  const pairs = (cols * rows) / 2;
  const pool = EMOJIS.slice(0, pairs);
  const deck = [...pool, ...pool]
    .map((emoji, i) => ({ id: i, emoji, matched: false, flipped: false }))
    .sort(() => Math.random() - 0.5);
  return deck;
}

export default function MemoryMatch() {
  const [level, setLevel] = useState<Level>("easy");
  const [deck, setDeck] = useState<Card[]>(() => buildDeck("easy"));
  const [first, setFirst] = useState<Card | null>(null);
  const [lock, setLock] = useState(false);
  const [moves, setMoves] = useState(0);
  const [sec, setSec] = useState(0);
  const [running, setRunning] = useState(false);
  const [won, setWon] = useState(false);
  const { playFlip, playMatch, playWin } = useSound();

  // Timer
  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setSec(s => s + 1), 1000);
    return () => clearInterval(t);
  }, [running]);

  // Start timer on first flip
  useEffect(() => {
    if (!running && deck.some(c => c.flipped || c.matched)) setRunning(true);
  }, [deck, running]);

  // Best scores in localStorage
  const best = useMemo(() => {
    try {
      const json = localStorage.getItem(LS_KEY);
      return json ? JSON.parse(json) as Record<Level, { sec: number; moves: number }> : {};
    } catch { return {}; }
  }, [won]); // refresh when a game ends

  function saveBest(level: Level, score: { sec: number; moves: number }) {
    try {
      const prev = localStorage.getItem(LS_KEY);
      const data = prev ? JSON.parse(prev) : {};
      const b = data[level] as { sec: number; moves: number } | undefined;
      if (!b || score.sec < b.sec || (score.sec === b.sec && score.moves < b.moves)) {
        data[level] = score;
        localStorage.setItem(LS_KEY, JSON.stringify(data));
      }
    } catch {}
  }

  // Optional: write to Supabase if session present. Fails safe if not configured.
  async function saveCloud(score: { sec: number; moves: number }) {
    try {
      const auth = await supabase?.auth?.getUser?.();
      const user = auth?.data?.user;
      if (!user) return;
      await supabase.from("scores").insert({
        mode: "memory_match",
        level,
        seconds: score.sec,
        moves: score.moves,
        user_id: user.id,
      });
    } catch {
      // ignore cloud errors
    }
  }

  function reset(newLevel: Level = level) {
    setLevel(newLevel);
    setDeck(buildDeck(newLevel));
    setFirst(null);
    setLock(false);
    setMoves(0);
    setSec(0);
    setRunning(false);
    setWon(false);
  }

  function onFlip(card: Card) {
    if (lock || card.flipped || card.matched) return;
    playFlip();

    const next = deck.map(c => (c.id === card.id ? { ...c, flipped: true } : c));
    setDeck(next);

    if (!first) {
      setFirst({ ...card, flipped: true });
      return;
    }

    // comparing
    setLock(true);
    setMoves(m => m + 1);

    const second = { ...card, flipped: true };
    if (first.emoji === second.emoji) {
      // match
      playMatch();
      setDeck(d => d.map(c =>
        c.emoji === first.emoji ? { ...c, matched: true } : c
      ));
      setFirst(null);
      setLock(false);
      // check win
      setTimeout(() => {
        const all = next.map(c =>
          c.emoji === first.emoji ? { ...c, matched: true, flipped: true } : c
        );
        const done = all.every(c => c.matched);
        if (done) {
          setRunning(false);
          setWon(true);
          playWin();
          const score = { sec, moves: moves + 1 };
          saveBest(level, score);
          void saveCloud(score);
        }
      }, 50);
    } else {
      // no match
      setTimeout(() => {
        setDeck(d => d.map(c =>
          c.id === first.id || c.id === second.id ? { ...c, flipped: false } : c
        ));
        setFirst(null);
        setLock(false);
      }, 650);
    }
  }

  const { cols, rows } = GRID_MAP[level];
  const gridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: `repeat(${cols}, minmax(64px, 1fr))`,
    gap: "12px",
    width: "min(720px, 92vw)",
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 text-slate-100">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">🧠 Memory Match</h1>
        <Link to="/zones/arcade" className="text-indigo-300 hover:underline">
          ← Back to Arcade
        </Link>
      </div>

      <p className="mt-2 text-slate-300">Flip two cards to find a pair. Beat your best time & moves!</p>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <label className="text-sm opacity-90">Level:</label>
        <select
          value={level}
          onChange={(e) => reset(e.target.value as Level)}
          className="rounded-md bg-slate-800/70 px-3 py-1.5 outline-none ring-1 ring-slate-600"
        >
          <option value="easy">Easy (4×4)</option>
          <option value="medium">Medium (5×4)</option>
          <option value="hard">Hard (6×6)</option>
        </select>

        <button
          onClick={() => reset()}
          className="rounded-md bg-indigo-500/90 px-3 py-1.5 text-sm font-semibold hover:bg-indigo-500"
        >
          Restart
        </button>

        <div className="ml-auto flex items-center gap-4 text-sm">
          <span>⏱️ Time: <strong>{String(Math.floor(sec/60)).padStart(2,"0")}:{String(sec%60).padStart(2,"0")}</strong></span>
          <span>🌀 Moves: <strong>{moves}</strong></span>
          <span className="opacity-80">
            🏆 Best:{" "}
            <strong>
              {best[level]?.sec != null
                ? `${best[level].sec}s / ${best[level].moves} moves`
                : "—"}
            </strong>
          </span>
        </div>
      </div>

      <div className="mt-8" style={gridStyle}>
        {deck.map((card) => {
          const show = card.flipped || card.matched;
          return (
            <button
              key={card.id}
              onClick={() => onFlip(card)}
              disabled={lock || card.matched}
              className={[
                "aspect-square select-none rounded-xl",
                "bg-slate-800/70 ring-1 ring-slate-700",
                "grid place-items-center text-3xl md:text-4xl",
                "transition-transform duration-150",
                show ? "scale-100" : "scale-[0.98] hover:scale-100",
              ].join(" ")}
              aria-label={show ? card.emoji : "Hidden card"}
            >
              <span className={show ? "opacity-100" : "opacity-25"}>{show ? card.emoji : "?"}</span>
            </button>
          );
        })}
      </div>

      {/* Win modal */}
      {won && (
        <div className="fixed inset-0 z-10 grid place-items-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 p-6 ring-1 ring-slate-700">
            <h2 className="text-2xl font-bold">🎉 You did it!</h2>
            <p className="mt-2 text-slate-300">
              Level <b>{level}</b> finished in <b>{sec}s</b> with <b>{moves}</b> moves.
            </p>
            <div className="mt-5 flex gap-3">
              <button
                onClick={() => reset(level)}
                className="rounded-md bg-indigo-500/90 px-4 py-2 font-semibold hover:bg-indigo-500"
              >
                Play again
              </button>
              <button
                onClick={() => reset("medium")}
                className="rounded-md bg-slate-800 px-4 py-2 ring-1 ring-slate-600 hover:bg-slate-700"
              >
                Try Medium
              </button>
              <Link
                to="/zones/arcade"
                className="ml-auto rounded-md bg-slate-800 px-4 py-2 ring-1 ring-slate-600 hover:bg-slate-700"
              >
                Back to Arcade
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

