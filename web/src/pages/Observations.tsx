import { useEffect, useState } from 'react';
import type { Observation } from '../types';

type User = { id: string; email: string } | null;

export default function Observations() {
  const [user, setUser] = useState<User>(null);
  const [observations, setObservations] = useState<Observation[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [optimisticObs, setOptimisticObs] = useState<Observation[]>([]);

  // Get user from /functions/user endpoint (simulate session)
  useEffect(() => {
    let mounted = true;
    const fetchUser = async () => {
      // For demo, get user_id from localStorage (simulate session)
      const user_id = localStorage.getItem('user_id');
      if (!user_id) {
        setUser(null);
        return;
      }
      const res = await fetch(`/functions/user?user_id=${user_id}`);
      const json = await res.json();
      if (mounted && json.data) setUser({ id: json.data.id, email: json.data.email });
      else setUser(null);
    };
    fetchUser();
    // No realtime auth state, so listen to storage events for demo
    const onStorage = () => fetchUser();
    window.addEventListener('storage', onStorage);
    return () => {
      mounted = false;
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  // Fetch only this user's observations
  async function fetchObservations() {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/functions/observations?user_id=${user.id}`);
      const json = await res.json();
      if (json.error) setError(json.error);
      else setObservations(json.data || []);
    } catch (e) {
      setError('Failed to fetch observations');
    }
    setLoading(false);
  }

  // Fetch observations on user change
  useEffect(() => {
    if (!user) return;
    fetchObservations();
    // No realtime, but could use polling or websockets if needed
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  // Optimistic insert
  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const tempId = 'temp-' + Math.random().toString(36).slice(2);
    const optimistic: Observation = {
      id: tempId,
      title,
      description,
      user_id: user?.id ?? null,
      created_at: new Date().toISOString(),
    };
    setOptimisticObs((prev) => [optimistic, ...prev]);
    setTitle('');
    setDescription('');
    try {
      const res = await fetch('/functions/observations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, user_id: user?.id }),
      });
      const json = await res.json();
      if (json.error) setError(json.error);
    } catch (e) {
      setError('Failed to add observation');
    }
    setOptimisticObs((prev) => prev.filter((o) => o.id !== tempId));
    fetchObservations();
  }

  // Optimistic delete
  async function handleDelete(id: string) {
    setError(null);
    setOptimisticObs((prev) => prev.filter((o) => o.id !== id));
    setObservations((prev) => prev.filter((o) => o.id !== id));
    try {
      const res = await fetch('/functions/observations', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, user_id: user?.id }),
      });
      const json = await res.json();
      if (json.error) setError(json.error);
    } catch (e) {
      setError('Failed to delete observation');
    }
    fetchObservations();
  }

  if (!user) {
    return <div style={{ maxWidth: 320, margin: '2rem auto', padding: 16, border: '1px solid #ccc', borderRadius: 8 }}>Sign in to view your observations.</div>;
  }

  const allObs = [...optimisticObs, ...observations.filter(o => !optimisticObs.some(opt => opt.id === o.id))];

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <h1 style={{ fontSize: 24, fontWeight: 600 }}>Observations</h1>
      <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Title"
          required
          style={{ padding: 8 }}
        />
        <input
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Description (optional)"
          style={{ padding: 8 }}
        />
        <button type="submit" disabled={!title}>Add</button>
      </form>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {allObs.map((o) => (
          <li key={o.id} style={{ border: '1px solid #ccc', borderRadius: 6, padding: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 500 }}>{o.title}</div>
              <div style={{ fontSize: 13, color: '#666' }}>{o.description}</div>
              <div style={{ fontSize: 11, color: '#999' }}>{new Date(o.created_at).toLocaleString()}</div>
            </div>
            <button onClick={() => handleDelete(o.id)} style={{ color: 'red', marginLeft: 12 }}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
