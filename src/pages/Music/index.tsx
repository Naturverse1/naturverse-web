import tracks from '../../content/music/index.json';
export default function Music() {
  return (
    <div className="container mx-auto p-4">
      <h1>Music</h1>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {tracks.map(t => (
          <li key={t.id} className="border rounded p-3">
            <div className="font-medium">{t.title}</div>
            <div className="text-sm opacity-70">BPM: {t.bpm}</div>
            <div className="text-xs mt-1">World: {t.world}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

