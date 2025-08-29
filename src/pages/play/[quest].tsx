// src/pages/play/[quest].tsx
import React from 'react';
import { useParams, Navigate } from 'react-router-dom'; // or your router equivalent
import { getQuest } from '../../lib/quests';
import QuestShell from '../../components/QuestShell';
import Leaderboard from '../../components/Leaderboard';

export default function PlayQuestPage() {
  const { quest: slugParam } = useParams<{ quest: string }>();
  const slug = String(slugParam || '');
  const quest = getQuest(slug);

  if (!quest) return <Navigate to="/" replace />;

  // Minimal placeholder “games” so page loads reliably.
  function renderGame(api: { complete: (score: number) => void }) {
    switch (slug) {
      case 'tuktuk-dash':
        return <DashGame onDone={api.complete} />;
      case 'spice-market':
        return <MemoryGame onDone={api.complete} />;
      case 'temple-trivia':
        return <TriviaGame onDone={api.complete} />;
      default:
        return <p>Coming soon…</p>;
    }
  }

  return (
    <main>
      <QuestShell slug={quest.slug} title={quest.title} onRenderGame={renderGame} />
      <Leaderboard slug={quest.slug} />
    </main>
  );
}

/* --- Ultra-light mock games (replace with your real components later) --- */
function DashGame({ onDone }: { onDone: (score: number) => void }) {
  return <button onClick={() => onDone(Math.floor(Math.random() * 120))}>Finish Dash (demo)</button>;
}
function MemoryGame({ onDone }: { onDone: (score: number) => void }) {
  return <button onClick={() => onDone(100 + Math.floor(Math.random() * 200))}>Finish Memory (demo)</button>;
}
function TriviaGame({ onDone }: { onDone: (score: number) => void }) {
  return <button onClick={() => onDone(60 + Math.floor(Math.random() * 60))}>Finish Trivia (demo)</button>;
}
