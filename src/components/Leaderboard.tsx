import { useEffect, useState } from 'react';
import { getLeaderboard, LeaderboardEntry } from '@/lib/leaderboard';
import { useAuth } from '@/lib/auth-context';

export default function Leaderboard({ questSlug }: { questSlug: string }) {
  const { user } = useAuth();
  const [top, setTop] = useState<LeaderboardEntry[] | null>(null);
  const [self, setSelf] = useState<LeaderboardEntry | null>(null);

  useEffect(() => {
    let cancelled = false;
    getLeaderboard(questSlug).then((res) => {
      if (cancelled) return;
      setTop(res.top);
      setSelf(res.self);
    });
    return () => {
      cancelled = true;
    };
  }, [questSlug]);

  if (!top) {
    return <div className="skeleton" style={{ height: 120 }} />;
  }

  return (
    <section>
      <h2>Leaderboard</h2>
      {top.length === 0 ? (
        <p>No scores yet.</p>
      ) : (
        <ol>
          {top.map((row) => (
            <li key={row.rank}>
              {row.rank}. {row.username || row.user_id.slice(0, 6)} — {row.best_score}
            </li>
          ))}
        </ol>
      )}
      {user ? (
        self && !top.some((r) => r.user_id === user.id) ? (
          <p>Your rank: {self.rank}</p>
        ) : null
      ) : (
        <p>
          <a href="/login">Sign in to compete</a>
        </p>
      )}
    </section>
  );
}
