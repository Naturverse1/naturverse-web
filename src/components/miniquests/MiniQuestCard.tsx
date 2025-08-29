import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Badge from '../Badge';
import { getProgress } from '../../lib/progress';

type Props = {
  slug: string;
  title: string;
  blurb: string;
  difficulty?: number;
  zone?: string;
};

export default function MiniQuestCard({ slug, title, blurb, difficulty = 1, zone }: Props) {
  const [best, setBest] = useState(0);
  const [status, setStatus] = useState<'new' | 'started' | 'completed'>('new');

  const refresh = () => {
    const p = getProgress(slug);
    setBest(Number(p?.score || 0));
    setStatus((p?.status as any) || 'new');
  };

  useEffect(() => {
    refresh();
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'nv.quest.progress.v1') refresh();
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [slug]);

  const tone = status === 'completed' ? 'success' : status === 'started' ? 'info' : 'muted';

  return (
    <article className="card">
      <header className="card__header">
        <h3 className="card__title">{title}</h3>
        <Badge tone={tone}>
          {status === 'new' ? 'New' : status[0].toUpperCase() + status.slice(1)}
        </Badge>
      </header>

      <p className="card__meta">
        {zone ? <Badge tone="muted">{zone}</Badge> : null} <Badge tone="muted">•</Badge>{' '}
        <Badge tone="muted">
          {'★'.repeat(difficulty)}
          {'☆'.repeat(Math.max(0, 5 - difficulty))}
        </Badge>
      </p>

      <p className="card__blurb">{blurb}</p>

      <footer className="card__footer">
        <span className="card__best">
          Best: <strong>{best}</strong>
        </span>
        <Link className="btn" to={`/play/${slug}`}>
          Play
        </Link>
      </footer>
    </article>
  );
}
