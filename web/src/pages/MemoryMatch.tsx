import { useEffect, useMemo, useRef, useState } from "react";

type Card = {
  id: number;         // unique per card instance
  key: string;        // pair id
  emoji: string;
  flipped: boolean;
  matched: boolean;
};

const EMOJIS = ["🐢","🦋","🦀","🐸","🦉","🦎","🐠","🦜"]; // 8 pairs = 16 cards

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildDeck(): Card[] {
  const pairs = EMOJIS.flatMap((e, i) => [
    { id: i * 2, key: `k${i}`, emoji: e, flipped: false, matched: false },
    { id: i * 2 + 1, key: `k${i}`, emoji: e, flipped: false, matched: false },
  ]);
  return shuffle(pairs);
}

export default function MemoryMatch() {
  const [deck, setDeck] = useState<Card[]>(() => buildDeck());
  const [first, setFirst] = useState<Card | null>(null);
  const [second, setSecond] = useState<Card | null>(null);
  const [moves, setMoves] = useState(0);
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [best, setBest] = useState<number | null>(() => {
    const v = localStorage.getItem("mm_best_time");
    return v ? Number(v) : null;
  });
  const tickRef = useRef<number | null>(null);

  const allMatched = useMemo(() => deck.every((c) => c.matched), [deck]);

  useEffect(() => {
    if (running && !allMatched) {
      tickRef.current = window.setInterval(() => setElapsed((s) => s + 1), 1000);
      return () => {
        if (tickRef.current) window.clearInterval(tickRef.current);
      };
    }
    return;
  }, [running, allMatched]);

  useEffect(() => {
    if (allMatched && running) {
      setRunning(false);
      if (tickRef.current) window.clearInterval(tickRef.current);
      if (best == null || elapsed < best) {
        setBest(elapsed);
        localStorage.setItem("mm_best_time", String(elapsed));
      }
    }
  }, [allMatched, running, best, elapsed]);

  function flipCard(card: Card) {
    if (card.flipped || card.matched || (first && second) || allMatched) return;

    if (!running) setRunning(true);

    setDeck((d) => d.map((c) => (c.id === card.id ? { ...c, flipped: true } : c)));

    if (!first) {
      setFirst({ ...card, flipped: true });
      return;
    }
    if (!second) {
      const secondCard = { ...card, flipped: true };
      setSecond(secondCard);
      setMoves((m) => m + 1);

      // check match after a short delay
      window.setTimeout(() => {
        setDeck((d) => {
          if (first.key === secondCard.key) {
            return d.map((c) =>
              c.key === card.key ? { ...c, matched: true } : c
            );
          } else {
            return d.map((c) =>
              c.id === first.id || c.id === secondCard.id
                ? { ...c, flipped: false }
                : c
            );
          }
        });
        setFirst(null);
        setSecond(null);
      }, 650);
    }
  }

  function reset() {
    if (tickRef.current) window.clearInterval(tickRef.current);
    setDeck(buildDeck());
    setFirst(null);
    setSecond(null);
    setMoves(0);
    setElapsed(0);
    setRunning(false);
  }

  return (
    <div style={{ maxWidth: 980, margin: "0 auto", padding: "2rem 1rem" }}>
      <h1>🧠 Memory Match</h1>
      <p style={{ opacity: 0.9, marginTop: 8 }}>
        Flip two cards to find a pair. Match all 16 cards as fast as you can!
      </p>

      <div style={{ display: "flex", gap: "1rem", alignItems: "center", margin: "1rem 0" }}>
        <strong>Time:</strong> <Time s={elapsed} />
        <strong style={{ marginLeft: 16 }}>Moves:</strong> {moves}
        {best != null && (
          <span style={{ marginLeft: 16, opacity: 0.85 }}>
            Best: <Time s={best} />
          </span>
        )}
        <button onClick={reset} style={btnStyle}>Restart</button>
        <a href="/zones/arcade" style={{ marginLeft: "auto" }}>← Back to Arcade</a>
      </div>

      <div style={boardStyle}>
        {deck.map((card) => (
          <CardView
            key={card.id}
            card={card}
            onFlip={() => flipCard(card)}
          />
        ))}
      </div>

      {allMatched && (
        <div style={winStyle}>
          <h2>🎉 You did it!</h2>
          <p>
            Time <b><Time s={elapsed} /></b> • Moves <b>{moves}</b>
            {best != null && elapsed <= best ? " • New best! 🥇" : ""}
          </p>
          <button onClick={reset} style={btnStyle}>Play again</button>
        </div>
      )}
    </div>
  );
}

function Time({ s }: { s: number }) {
  const mm = Math.floor(s / 60).toString().padStart(2, "0");
  const ss = (s % 60).toString().padStart(2, "0");
  return <span>{mm}:{ss}</span>;
}

function CardView({ card, onFlip }: { card: Card; onFlip: () => void }) {
  const face = card.flipped || card.matched;
  return (
    <button
      onClick={onFlip}
      disabled={card.matched}
      aria-label={face ? card.emoji : "Hidden card"}
      style={{
        ...tileStyle,
        cursor: card.matched ? "default" : "pointer",
        opacity: card.matched ? 0.6 : 1,
        transform: face ? "rotateY(0deg)" : "rotateY(180deg)",
      }}
    >
      <div style={{ fontSize: 36, lineHeight: 1 }}>{face ? card.emoji : "❓"}</div>
    </button>
  );
}

const boardStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(4, minmax(70px, 1fr))",
  gap: "12px",
  perspective: "800px",
  maxWidth: 520,
  margin: "1rem auto",
};

const tileStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: 12,
  padding: "16px 0",
  display: "grid",
  placeItems: "center",
  transition: "transform 0.3s ease, background 0.2s ease",
  transformStyle: "preserve-3d",
  willChange: "transform",
};

const btnStyle: React.CSSProperties = {
  border: "1px solid rgba(255,255,255,0.2)",
  background: "rgba(255,255,255,0.08)",
  padding: "8px 12px",
  borderRadius: 8,
};

const winStyle: React.CSSProperties = {
  textAlign: "center",
  marginTop: 16,
  padding: "16px 12px",
  border: "1px solid rgba(255,255,255,0.15)",
  borderRadius: 12,
  background: "rgba(255,255,255,0.05)",
};
