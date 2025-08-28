import React from 'react';

export default function MiniQuests() {
  const quests = [
    { title: 'Explore Thailandia', desc: 'Visit the first kingdom and meet Turian.' },
    { title: 'Earn Your First Stamp', desc: 'Complete a quiz and unlock a passport stamp.' },
    { title: 'Meet a Friend', desc: 'Say hello to Coconut Cruze in Lotus Lake.' },
  ];

  return (
    <section className="mini-quests">
      <h2 className="text-xl font-bold mt-8 mb-4">Mini-Quests</h2>
      <ul className="space-y-3">
        {quests.map((q, i) => (
          <li key={i} className="border p-3 rounded-md bg-blue-50">
            <strong>{q.title}</strong>
            <p className="text-sm text-gray-600">{q.desc}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
