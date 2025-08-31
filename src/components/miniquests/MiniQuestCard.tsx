import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Badge from '../Badge';
import { getActive } from '../../lib/navatar';
import { getNavatarMeta } from '../../lib/navatar-meta';
import { getQuestProgress } from '../../lib/progress';

type Props = {
  slug: string;
  title: string;
  description: string;
  difficulty?: number;
  zone?: string;
};

export default function MiniQuestCard({ slug, title, description, difficulty = 1, zone }: Props) {
  const [best, setBest] = useState<number | null>(null);
  const [completed, setCompleted] = useState(false);
  const [activeNav, setActiveNav] = useState<ReturnType<typeof getNavatarMeta>>(null);

  const refresh = async () => {
    const p = await getQuestProgress(slug);
    setBest(p.bestScore);
    setCompleted(p.completed);
  };

  useEffect(() => {
    refresh();
    const onStorage = (e: StorageEvent) => {
      if (e.key && e.key.startsWith('nv:progress:')) refresh();
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [slug]);

  useEffect(() => {
    getActive().then((id) => setActiveNav(getNavatarMeta(id)));
  }, []);

  const tone = completed ? 'success' : 'info';

  return (
    <article className="card">
      <header className="card__header">
        <h3 className="card__title">{title}</h3>
        <Badge tone={tone}>{completed ? '✅ Completed' : '🔵 New'}</Badge>
      </header>

      <p className="card__meta">
        {zone ? <Badge tone="muted">{zone}</Badge> : null} <Badge tone="muted">•</Badge>{' '}
        <Badge tone="muted">
          {'★'.repeat(difficulty)}
          {'☆'.repeat(Math.max(0, 5 - difficulty))}
        </Badge>
      </p>

      <p className="card__blurb">{description}</p>

      <footer className="card__footer">
        <span className="card__best">
          {activeNav && (
            <span className={`navatar-frame ${activeNav.rarity}`} title="Your Navatar">
              <img
                src={activeNav.img}
                width={20}
                height={20}
                style={{ borderRadius: '50%' }}
                alt={activeNav.name}
              />
            </span>
          )}{' '}
          {best === null ? (
            <span className="skeleton" style={{ width: 20 }} />
          ) : (
            <span>⭐ Best: <strong>{best}</strong></span>
          )}
        </span>
        <Link className="btn" to={`/play/${slug}`}>
          Play
        </Link>
      </footer>
      <p className="card__meta">
        <Link to={`/play/${slug}#leaderboard`}>🏆 View leaderboard</Link>
      </p>
    </article>
  );
}
