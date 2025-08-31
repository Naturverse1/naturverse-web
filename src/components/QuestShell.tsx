// src/components/QuestShell.tsx
import React from 'react';
import { saveQuestProgress, getQuestProgress, getQuestCloudProgress, postScore } from '../lib/progress';

type Props = {
  slug: string;
  title: string;
  onRenderGame: (api: { complete: (score: number) => void }) => React.ReactNode;
};

export default function QuestShell({ slug, title, onRenderGame }: Props) {
  const [best, setBest] = React.useState(0);
  const [completed, setCompleted] = React.useState(false);
  const [runScore, setRunScore] = React.useState<number | null>(null);
  const [gameKey, setGameKey] = React.useState(0);

  React.useEffect(() => {
    const local = getQuestProgress(slug);
    setBest(local.bestScore);
    setCompleted(local.completed);
    getQuestCloudProgress(slug).then((cloud) => {
      if (cloud) {
        setBest(cloud.bestScore);
        setCompleted(cloud.completed);
      }
    });
  }, [slug]);

  function complete(score: number) {
    setRunScore(score);
    saveQuestProgress({ slug, score, completed: true });
    postScore(slug, score);
    const next = getQuestProgress(slug);
    setBest(next.bestScore);
    setCompleted(next.completed);
  }

  async function share() {
    if (runScore == null) return;
    const url = `${window.location.origin}/play/${slug}`;
    const text = `I scored ${runScore} on ${title}!`;
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
      } catch {
        /* ignore */
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
      } catch {
        /* ignore */
      }
    }
  }

  function playAgain() {
    setRunScore(null);
    setGameKey((k) => k + 1);
  }

  return (
    <section aria-labelledby="quest-title">
      <header className="quest__header">
        <h1 id="quest-title">{title}</h1>
        <div className="quest__meta">
          <span className="badge">{completed ? '✅ Completed' : '🔵 New'}</span>
          <span className="badge best">⭐ Best: {best}</span>
        </div>
      </header>

      <div className="quest__body">
        {runScore === null ? (
          <React.Fragment key={gameKey}>{onRenderGame({ complete })}</React.Fragment>
        ) : (
          <div className="quest__result">
            <p>Best: {best}</p>
            <p>This run: {runScore}</p>
            <div className="quest__actions">
              <button className="btn" onClick={share}>
                Share
              </button>
              <button className="btn" onClick={playAgain}>
                Play again
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
