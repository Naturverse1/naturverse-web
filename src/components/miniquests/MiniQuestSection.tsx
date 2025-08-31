import React from 'react';
import MiniQuestCard from './MiniQuestCard';
import { QUESTS } from '@/lib/quests';

export default function MiniQuestSection() {
  return (
    <section aria-labelledby="mini-quests">
      <h2 id="mini-quests">Mini-Quests in Thailandia</h2>
      <div className="mq-grid">
        {QUESTS.map((q) => (
          <MiniQuestCard
            key={q.slug}
            slug={q.slug}
            title={q.title}
            description={q.description}
            difficulty={q.difficulty}
            zone={q.zone}
          />
        ))}
      </div>
    </section>
  );
}
