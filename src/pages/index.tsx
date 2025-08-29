// src/pages/index.tsx (home strip hookup)
import { QUESTS } from '../lib/quests';
import { getProgress } from '../lib/progress';
import { Link } from 'react-router-dom'; // or next/link etc.

function MiniQuestsStrip() {
  return (
    <section aria-labelledby="mini-quests">
      <h2 id="mini-quests">Mini-Quests in Thailandia</h2>
      <div className="grid">
        {QUESTS.map(q => {
          const { bestScore } = getProgress(q.slug);
          return (
            <article key={q.slug} className="card">
              <h3>{q.title}</h3>
              <p className="muted">{q.description}</p>
              <p className="muted">Best: {bestScore}</p>
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
