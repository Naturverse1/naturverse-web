import React from 'react';
import MiniQuestCard from './MiniQuestCard';
import { MINI_QUESTS } from '../../data/miniquests';

export default function MiniQuestSection() {
  return (
    <section aria-labelledby="mini-quests">
      <h2 id="mini-quests">Mini-Quests in Thailandia</h2>
      <div className="mq-grid">
        {MINI_QUESTS.map((q) => (
          <MiniQuestCard
            key={q.slug}
            slug={q.slug}
            title={q.title}
            blurb={q.blurb}
            difficulty={q.difficulty}
            zone={q.zone}
          />
        ))}
      </div>
    </section>
  );
}
