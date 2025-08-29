// src/components/Leaderboard.tsx
import React from 'react';
import { fetchLeaderboard, queueFlush } from '../lib/leaderboard';
import NavatarBadge from './NavatarBadge';

type Row = { rank: number; name: string | null; score: number; time: string; avatar_url: string | null };

export default function Leaderboard({ questId }: { questId: string }) {
  const [rows, setRows] = React.useState<Row[] | null>(null);

  React.useEffect(() => {
    queueFlush();
    fetchLeaderboard(questId).then(setRows);
  }, [questId]);

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
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Score</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.rank}>
                <td>{r.rank}</td>
                <td>
                  <NavatarBadge url={r.avatar_url ?? undefined} size={20} alt={r.name ?? 'Navatar'} />{' '}
                  {r.name ?? 'Explorer'}
                </td>
                <td>{r.score}</td>
                <td>{new Date(r.time).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
