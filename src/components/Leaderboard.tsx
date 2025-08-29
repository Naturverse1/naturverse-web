// src/components/Leaderboard.tsx
import React from 'react';
import { getLeaderboard } from '../lib/leaderboard';

export default function Leaderboard({ slug }: { slug: string }) {
  const [rows, setRows] = React.useState<{ rank: number; username: string | null; best_score: number }[] | null>(null);

  React.useEffect(() => {
    getLeaderboard(slug).then(setRows);
  }, [slug]);

  if (rows === null) {
    return (
      <div className="card">
        <h2>Leaderboard</h2>
        <p className="muted">Loading…</p>
      </div>
    );
  }

  return (
    <div className="card" id="leaderboard">
      <h2>Leaderboard</h2>
      {rows.length === 0 ? (
        <p className="muted">No scores yet — be the first!</p>
      ) : (
        <ol className="leaderboard">
          {rows.map(r => (
            <li key={r.rank}>
              <span className="rank">#{r.rank}</span>
              <span className="name">{r.username ?? 'Explorer'}</span>
              <span className="score">{r.best_score}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
