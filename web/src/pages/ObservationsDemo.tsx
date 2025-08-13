import { useEffect, useState } from 'react';

export default function ObservationsDemo() {
  const [health, setHealth] = useState<string>('');
  const [observations, setObservations] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/health')
      .then((r) => r.json())
      .then((d) => setHealth(d.ok ? 'Healthy' : 'Unhealthy'));
    fetchObservations();
  }, []);

  function fetchObservations() {
    fetch('/api/observations')
      .then((r) => r.json())
      .then((d) => setObservations(d.data || []));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const res = await fetch('/api/observations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description }),
    });
    const data = await res.json();
    if (!data.ok) setError(data.error);
    else {
      setTitle('');
      setDescription('');
      fetchObservations();
    }
  }

  return (
    <div>
      <h2>API Health: {health}</h2>
      <form onSubmit={handleSubmit}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          required
        />
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
        />
        <button type="submit">Add Observation</button>
      </form>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <ul>
        {observations.map((o) => (
          <li key={o.id}>
            <b>{o.title}</b>: {o.description} <i>{o.created_at}</i>
          </li>
        ))}
      </ul>
    </div>
  );
}
