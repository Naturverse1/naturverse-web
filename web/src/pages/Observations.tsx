import { useEffect, useState } from 'react';

interface Observation {
  id: string;
  title: string;
  description?: string;
  created_at: string;
}

export default function Observations() {
  const [observations, setObservations] = useState<Observation[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchObservations() {
    setLoading(true);
    setError(null);
    const res = await fetch('/api/observations');
    const data = await res.json();
    if (!data.ok) setError(data.error || 'Failed to load');
    else setObservations(data.data || []);
    setLoading(false);
  }

  useEffect(() => {
    fetchObservations();
  }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch('/api/observations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description }),
    });
    const data = await res.json();
    if (!data.ok) setError(data.error || 'Failed to add');
    else {
      setTitle('');
      setDescription('');
      fetchObservations();
    }
    setLoading(false);
  }

  async function handleDelete(id: string) {
    setLoading(true);
    setError(null);
    const res = await fetch(`/api/observations/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (!data.ok) setError(data.error || 'Failed to delete');
    else fetchObservations();
    setLoading(false);
  }

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Observations</h1>
      <form
        onSubmit={handleAdd}
        className="mb-4 flex flex-col gap-2 border p-4 rounded-lg bg-card border-border"
      >
        <input
          className="border border-border rounded p-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          required
        />
        <input
          className="border border-border rounded p-2"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description (optional)"
        />
        <button className="bg-primary text-white rounded p-2" type="submit" disabled={loading}>
          Add
        </button>
      </form>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {loading && <div>Loading...</div>}
      <ul className="space-y-2">
        {observations.map((o) => (
          <li
            key={o.id}
            className="border p-3 rounded-lg flex justify-between items-center bg-card border-border"
          >
            <div>
              <div className="font-semibold">{o.title}</div>
              <div className="text-sm text-muted-foreground">{o.description}</div>
              <div className="text-xs text-muted-foreground">
                {new Date(o.created_at).toLocaleString()}
              </div>
            </div>
            <button
              className="text-red-500 ml-4"
              onClick={() => handleDelete(o.id)}
              disabled={loading}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
