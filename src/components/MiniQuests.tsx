import React from 'react';
import { fetchMiniQuests, type MiniQuest } from '../lib/miniquests';

export default function MiniQuests() {
  const [quests, setQuests] = React.useState<MiniQuest[] | null>(null);

  React.useEffect(() => {
    let mounted = true;
    fetchMiniQuests().then(q => { if (mounted) setQuests(q); });
    return () => { mounted = false; };
  }, []);

  return (
    <section className="mini-quests">
      <h2 className="text-xl font-bold mt-8 mb-4">Mini-Quests</h2>

      {!quests && (
        <div className="text-sm text-gray-500">Loading quests…</div>
      )}

      {quests && quests.length > 0 && (
        <ul className="space-y-3">
          {quests.map((q, i) => (
            <li key={i} className="border p-3 rounded-md bg-blue-50">
              <strong>{q.title}</strong>
              <p className="text-sm text-gray-600">{q.description}</p>
            </li>
          ))}
        </ul>
      )}

      {quests && quests.length === 0 && (
        <div className="text-sm text-gray-500">No quests yet.</div>
      )}
    </section>
  );
}
