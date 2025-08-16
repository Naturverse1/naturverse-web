import { useEffect, useState } from 'react';

type Observation = {
  id: number;
  title: string;
  description?: string;
  created_at: string;
};

type ApiResponse = {
  ok: boolean;
  data?: Observation[];
  error?: string;
};

export default function ObservationsPage() {
  const [observations, setObservations] = useState<Observation[] | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchObservations() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/observations');
      const json: ApiResponse = await res.json();
      if (json.ok) setObservations(json.data ?? []);
      else setError(json.error || 'Unknown error');
    } catch (e: any) {
      setError(e.message || String(e));
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchObservations();
  }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch('/api/observations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description }),
      });
      const json: ApiResponse = await res.json();
      if (json.ok) {
        setTitle('');
        setDescription('');
        fetchObservations();
      } else {
        setError(json.error || 'Unknown error');
      }
    } catch (e: any) {
      setError(e.message || String(e));
    }
  }

  return (
    <div style={{ maxWidth: 500, margin: '2rem auto', padding: 16 }}>
      <h1>Observations</h1>
      <form onSubmit={handleAdd} style={{ marginBottom: 24 }}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          required
          style={{ width: '100%', marginBottom: 8 }}
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description (optional)"
          style={{ width: '100%', marginBottom: 8 }}
        />
        <button type="submit">Add Observation</button>
      </form>
      {loading ? (
        <div>Loading…</div>
      ) : error ? (
        <div style={{ color: 'red' }}>{error}</div>
      ) : (
        <ul>
          {observations && observations.length > 0 ? (
            observations.map((obs) => (
              <li key={obs.id}>
                <strong>{obs.title}</strong>
                {obs.description && <span>: {obs.description}</span>}
                <div style={{ fontSize: 12, color: '#888' }}>
                  {new Date(obs.created_at).toLocaleString()}
                </div>
              </li>
            ))
          ) : (
            <li>No observations yet.</li>
          )}
        </ul>
      )}
    </div>
  );
}
