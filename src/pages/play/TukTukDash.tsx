import { useEffect, useState } from 'react';
import QuestShell from './QuestShell';

export default function TukTukDash() {
  return (
    <QuestShell slug="tuktuk-dash" title="Tuk-Tuk Dash">
      {({ complete }) => <Dash complete={complete} />}
    </QuestShell>
  );
}

function Dash({ complete }: { complete: (n: number) => void }) {
  const duration = 10_000;
  const [score, setScore] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      complete(score);
      alert(`Time! You scored ${score}`);
      window.location.href = '/';
    }, duration);
    return () => clearTimeout(timer);
  }, [score, complete]);

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
