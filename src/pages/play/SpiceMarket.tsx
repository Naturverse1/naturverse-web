import QuestShell from './QuestShell';

export default function SpiceMarket() {
  return (
    <QuestShell slug="spice-market" title="Spice Market (Memory)">
      {({ complete }) => <Memory complete={complete} />}
    </QuestShell>
  );
}

function Memory({ complete }: { complete: (n: number) => void }) {
  const spices = ['🌶️', '🧄', '🧅', '🧂', '🍋', '🥥'];
  const cards = [...spices, ...spices].sort(() => Math.random() - 0.5);
  let picks: number[] = [];
  let matches = 0;

  const onPick = (i: number) => {
    if (picks.includes(i)) return;
    picks.push(i);
    if (picks.length === 2) {
      const [a, b] = picks;
      if (cards[a] === cards[b]) matches++;
      picks = [];
      if (matches === spices.length) {
        const score = Math.max(100 - Math.floor(Math.random() * 20), 60);
        complete(score);
        alert('Delicious! You cleared the market ✨');
        window.location.href = '/';
      }
    }
  };

  return (
    <div className="grid grid-3">
      {cards.map((c, i) => (
        <button key={i} onClick={() => onPick(i)} className="card">
          {c}
        </button>
      ))}
    </div>
  );
}
