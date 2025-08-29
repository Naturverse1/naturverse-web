// src/components/QuestShell.tsx
import React from 'react';
import { saveProgress, getProgress, getCloudProgress } from '../lib/progress';

type Props = {
  slug: string;
  title: string;
  onRenderGame: (api: { complete: (score: number) => void }) => React.ReactNode;
};

export default function QuestShell({ slug, title, onRenderGame }: Props) {
  const [best, setBest] = React.useState(0);
  const [completed, setCompleted] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    const local = getProgress(slug);
    setBest(local.bestScore);
    setCompleted(local.completed);
    getCloudProgress(slug).then((cloud) => {
      if (cloud) {
        setBest(cloud.bestScore);
        setCompleted(cloud.completed);
      }
    });
  }, [slug]);

  async function complete(score: number) {
    setSubmitting(true);
    await saveProgress({ slug, score, completed: true });
    const next = getProgress(slug);
    setBest(next.bestScore);
    setCompleted(next.completed);
    setSubmitting(false);
  }

  return (
    <section aria-labelledby="quest-title">
      <header className="quest__header">
        <h1 id="quest-title">{title}</h1>
        <div className="quest__meta">
          <span className="badge">{completed ? 'Completed' : 'New'}</span>
          <span className="best">Best: {best}</span>
        </div>
      </header>

      <div className="quest__body">
        {onRenderGame({ complete })}
      </div>

      {submitting && <p className="muted">Saving score…</p>}
    </section>
  );
}
