import { useState } from 'react';
import QuestShell from './QuestShell';

export default function TempleTrivia() {
  return (
    <QuestShell slug="temple-trivia" title="Temple Trivia">
      {({ complete }) => <Trivia complete={complete} />}
    </QuestShell>
  );
}

function Trivia({ complete }: { complete: (n: number) => void }) {
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
      complete(finalScore);
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
