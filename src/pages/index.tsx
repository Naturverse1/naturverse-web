// src/pages/index.tsx (home strip hookup)
import React from 'react';
import { QUESTS } from '../lib/quests';
import { getQuestProgress } from '../lib/progress';
import { fetchLeaderboard, queueFlush } from '../lib/leaderboard';
import { Link } from 'react-router-dom'; // or next/link etc.

function MiniQuestsStrip() {
  const [topRows, setTopRows] = React.useState<Record<string, number[]>>({});

  React.useEffect(() => {
    queueFlush();
    QUESTS.forEach((q) => {
      fetchLeaderboard(q.slug, 3).then((rows) => {
        setTopRows((prev) => ({ ...prev, [q.slug]: rows.map((r) => r.score) }));
      });
    });
  }, []);

  return (
    <section aria-labelledby="mini-quests">
      <h2 id="mini-quests">Mini-Quests in Thailandia</h2>
      <div className="grid">
        {QUESTS.map((q) => {
          const { bestScore } = getQuestProgress(q.slug);
          const top = topRows[q.slug];
          return (
            <article key={q.slug} className="card">
              <h3>{q.title}</h3>
              <p className="muted">{q.description}</p>
              <p className="muted small">⭐ Best: {bestScore}</p>
              <p className="muted small">
                🏆
                {top ? (
                  ` 🥇 ${top[0] ?? '—'} • 🥈 ${top[1] ?? '—'} • 🥉 ${top[2] ?? '—'}`
                ) : (
                  <span className="skeleton">🥇 — • 🥈 — • 🥉 —</span>
                )}
              </p>
              <Link to={`/play/${q.slug}`} className="btn btn-primary">Play</Link>
              <Link to={`/play/${q.slug}#leaderboard`} className="btn btn-link" style={{ marginLeft: 8 }}>
                🏆 View leaderboard
              </Link>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default MiniQuestsStrip; // or integrate into your existing Home component
