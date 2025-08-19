import React, { useMemo, useState } from "react";

const ALL = ["🐸","🦋","🦎","🍃","🌿","🌸","🪲","🐚"];
function shuffled<T>(arr: T[]) { return [...arr].sort(() => Math.random() - 0.5); }

type Card = { id: number; emoji: string; flipped: boolean; matched: boolean };

export default function BrainChallenge() {
  const [cards, setCards] = useState<Card[]>(() => {
    const base = shuffled(ALL).slice(0, 6);
    const deck = shuffled([...base, ...base]).map((e, i) => ({ id: i, emoji: e, flipped: false, matched: false }));
    return deck;
  });
  const [openIds, setOpenIds] = useState<number[]>([]);
  const matchedCount = useMemo(() => cards.filter(c => c.matched).length, [cards]);

  function flip(id: number) {
    if (openIds.length === 2 || cards[id].flipped || cards[id].matched) return;
    const next = cards.map(c => (c.id === id ? { ...c, flipped: true } : c));
    const newOpen = [...openIds, id];
    setCards(next); setOpenIds(newOpen);

    if (newOpen.length === 2) {
      const [a, b] = newOpen.map(i => next[i]);
      setTimeout(() => {
        if (a.emoji === b.emoji) {
          setCards(cur => cur.map(c => (c.id === a.id || c.id === b.id) ? { ...c, matched: true } : c));
        } else {
          setCards(cur => cur.map(c => (c.id === a.id || c.id === b.id) ? { ...c, flipped: false } : c));
        }
        setOpenIds([]);
      }, 550);
    }
  }

  function reset() {
    const base = shuffled(ALL).slice(0, 6);
    const deck = shuffled([...base, ...base]).map((e, i) => ({ id: i, emoji: e, flipped: false, matched: false }));
    setCards(deck); setOpenIds([]);
  }

  return (
    <section>
      <h1>🧠 Brain Challenge</h1>
      <p>Flip two matching nature icons. Clear the board to win!</p>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,70px)", gap: 12, marginTop: 16 }}>
        {cards.map(c => (
          <button
            key={c.id}
            onClick={() => flip(c.id)}
            style={{
              width: 70, height: 70, fontSize: 28, borderRadius: 8,
              background: c.matched ? "#e7ffe7" : c.flipped ? "#fff" : "#e9eef6",
              border: "1px solid #d0d7de"
            }}
          >
            {(c.flipped || c.matched) ? c.emoji : "❔"}
          </button>
        ))}
      </div>
      <div style={{ marginTop: 14 }}>
        <strong>Matched:</strong> {matchedCount}/{cards.length}
        <button onClick={reset} style={{ marginLeft: 10 }}>Reset</button>
      </div>
    </section>
  );
}

