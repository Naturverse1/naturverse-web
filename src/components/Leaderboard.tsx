// src/components/Leaderboard.tsx
import React from 'react';
import { fetchLeaderboard, queueFlush } from '../lib/leaderboard';
import { getActive } from '../lib/navatar';
import { getNavatarMeta } from '../lib/navatar-meta';

type Row = { rank: number; name: string | null; score: number; time: string; avatar_url: string | null; is_self?: boolean };

export default function Leaderboard({ questId }: { questId: string }) {
  const [rows, setRows] = React.useState<Row[] | null>(null);
  const [myNavatar, setMyNavatar] = React.useState<ReturnType<typeof getNavatarMeta>>(null);

  React.useEffect(() => {
    queueFlush();
    fetchLeaderboard(questId).then(setRows);
  }, [questId]);

  React.useEffect(() => {
    getActive().then((id) => setMyNavatar(getNavatarMeta(id)));
  }, []);

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
            {rows.map((r) => {
              const mine = r.is_self === true;
              const avatar = mine ? myNavatar : null;
              return (
                <tr key={r.rank}>
                  <td>{r.rank}</td>
                  <td>
                    <span className="who" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                      <span className={`navatar-frame ${avatar?.rarity || 'starter'}`}>
                        <img
                          src={avatar?.img || '/navatars/seedling.svg'}
                          width={20}
                          height={20}
                          style={{ borderRadius: '50%' }}
                          alt=""
                        />
                      </span>
                      <span className="name">{r.name ?? 'Explorer'}</span>
                    </span>
                  </td>
                  <td>{r.score}</td>
                  <td>{new Date(r.time).toLocaleString()}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
