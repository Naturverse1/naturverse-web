import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import QuestShell from '@/components/QuestShell';
import Leaderboard from '@/components/Leaderboard';
import { QUESTS } from '@/lib/quests';
import { AppErrorBoundary } from '@/components/AppErrorBoundary';

type GameProps = { onComplete: (score: number) => void };

const GAMES: Record<string, (p: GameProps) => JSX.Element> = {
  'tuktuk-dash': TukTukDash,
  'spice-market': SpiceMarket,
  'temple-trivia': TempleTrivia,
};

export default function PlayQuest() {
  const { quest: slug } = useParams();
  const quest = QUESTS.find((q) => q.slug === slug);
  if (!quest) return <p>Unknown quest.</p>;
  const Game = GAMES[quest.slug];
  return (
    <AppErrorBoundary>
      <QuestShell quest={quest}>{({ onComplete }) => <Game onComplete={onComplete} />}</QuestShell>
      <div id="leaderboard" className="mt-4">
        <Leaderboard questSlug={quest.slug} />
      </div>
    </AppErrorBoundary>
  );
}

function TukTukDash({ onComplete }: GameProps) {
  const duration = 10000;
  const [score, setScore] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete(score);
      alert(`Time! You scored ${score}`);
      window.location.href = '/';
    }, duration);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') setScore((s) => s + 1);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', onKey);
    };
  }, [score, onComplete]);
  return (
    <section>
      <p>Click the tuk-tuk as many times as you can in 10s!</p>
      <button onClick={() => setScore((s) => s + 1)} aria-label="tuk-tuk">
        🛺
      </button>
      <p>Clicks: {score}</p>
    </section>
  );
}

function SpiceMarket({ onComplete }: GameProps) {
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
        onComplete(score);
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

function TempleTrivia({ onComplete }: GameProps) {
  const Q = [
    { q: 'What are Thai temples called?', a: ['Wats', 'Pagodas', 'Stupas'], i: 0 },
    { q: 'Which city hosts Wat Phra Kaew?', a: ['Chiang Mai', 'Bangkok', 'Ayutthaya'], i: 1 },
    { q: 'Temple etiquette?', a: ['Shoes on', 'Quiet voice', 'Touch statues'], i: 1 },
  ];
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const next = (pick: number) => {
    const correct = pick === Q[idx].i;
    if (correct) setScore((s) => s + 40);
    if (idx + 1 === Q.length) {
      const finalScore = correct ? score + 40 : score;
      onComplete(finalScore);
      alert(`You scored ${finalScore} / 120 🏅`);
      window.location.href = '/';
    } else {
      setIdx((i) => i + 1);
    }
  };
  const current = Q[idx];
  return (
    <section>
      <h2>{current.q}</h2>
      <div className="stack">
        {current.a.map((t, i) => (
          <button key={i} onClick={() => next(i)}>
            {t}
          </button>
        ))}
      </div>
    </section>
  );
}
