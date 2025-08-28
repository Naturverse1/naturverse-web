import React from 'react';
import { MINI_QUESTS } from '../data/miniQuestsList';

export default function MiniQuests() {
  return (
    <section aria-labelledby="mini-quests">
      <h2 id="mini-quests">Mini-Quests in Thailandia</h2>
      <div className="nv-quests">
        {MINI_QUESTS.map(q => (
          <a key={q.id} className="nv-quest" href={q.href} aria-label={`${q.title}, ${q.estMinutes} minutes`}>
            <strong>{q.title}</strong>
            <span>{q.summary}</span>
            <small>{q.world} • {q.estMinutes} min</small>
          </a>
        ))}
      </div>
    </section>
  );
}
