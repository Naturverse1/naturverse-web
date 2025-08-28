import { useEffect } from 'react';
import { getProgress, saveProgress } from '../../lib/progress';

export default function QuestShell({
  slug,
  title,
  children,
}: {
  slug: string;
  title: string;
  children: (api: { complete: (score: number) => void; start: () => void }) => JSX.Element;
}) {
  useEffect(() => {
    saveProgress(slug, 0, 'started');
  }, [slug]);
  const complete = (score: number) => saveProgress(slug, score, 'completed');
  const start = () => saveProgress(slug, 0, 'started');

  const p = getProgress(slug);

  return (
    <main className="container">
      <h1>{title}</h1>
      <p className="muted">
        Status: {p.status} • Best score: {p.score}
      </p>
      {children({ complete, start })}
    </main>
  );
}
