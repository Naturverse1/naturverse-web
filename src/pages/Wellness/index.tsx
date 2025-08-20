import flows from '../../content/wellness/index.json';
export default function Wellness() {
  return (
    <div className="container mx-auto p-4">
      <h1>Wellness</h1>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {flows.map(f => (
          <li key={f.id} className="border rounded p-3">
            <div className="font-medium">{f.title}</div>
            <div className="text-sm opacity-70">Duration: {f.duration}</div>
            <div className="text-xs mt-1">World: {f.world}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

