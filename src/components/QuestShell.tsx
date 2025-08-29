import { ReactNode, useEffect, useState } from 'react';
import Badge from './Badge';
import { saveProgress, getProgress } from '@/lib/progress';
import { upsertLeaderboard } from '@/lib/leaderboard';
import { useToast } from './Toast';
import type { Quest } from '@/lib/quests';

export default function QuestShell({
  quest,
  children,
}: {
  quest: Quest;
  children: (api: { onComplete: (score: number) => void }) => ReactNode;
}) {
  const { slug, title } = quest;
  const toast = useToast();
  const [best, setBest] = useState<number | null>(null);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    saveProgress({ questSlug: slug, score: 0, completed: false });
    let cancelled = false;
    getProgress(slug).then((p) => {
      if (cancelled) return;
      setBest(p.bestScore);
      setCompleted(p.completed);
    });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const onComplete = async (score: number) => {
    await saveProgress({ questSlug: slug, score, completed: true });
    await upsertLeaderboard({ questSlug: slug, score });
    setBest((b) => Math.max(b || 0, score));
    setCompleted(true);
    toast({ text: 'Score submitted!', kind: 'ok' });
  };

  const badge = completed ? (
    <Badge tone="success">Completed</Badge>
  ) : best && best > 0 ? (
    <Badge tone="info">Started</Badge>
  ) : (
    <Badge tone="muted">New</Badge>
  );

  return (
    <main className="container">
      <h1>{title}</h1>
      <p className="muted">
        Best: {best ?? '--'} {badge}
      </p>
      {children({ onComplete })}
    </main>
  );
}
