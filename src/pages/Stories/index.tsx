import data from '../../content/stories/index.json';
export default function Stories() {
  return (
    <div className="container mx-auto p-4">
      <h1>Stories</h1>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {data.map(s => (
          <li key={s.id} className="border rounded p-3">
            <div className="font-medium">{s.title}</div>
            <div className="opacity-70 text-sm">{s.summary}</div>
            <div className="text-xs mt-1">World: {s.world}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

