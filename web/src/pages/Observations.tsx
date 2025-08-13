import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
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

  // Get user on mount and on auth state change
  useEffect(() => {
    let mounted = true;
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (mounted) setUser(data.user ? { id: data.user.id, email: data.user.email } : null);
    };
    getUser();
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ? { id: session.user.id, email: session.user.email } : null);
    });
    return () => {
      mounted = false;
      listener?.subscription.unsubscribe();
    };
  }, []);

  // Fetch only this user's observations
  async function fetchObservations() {
    if (!user) return;
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('observations')
      .select('id, title, description, user_id, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (error) setError(error.message);
    else setObservations(data || []);
    setLoading(false);
  }

  // Subscribe to realtime changes for this user's rows
  useEffect(() => {
    if (!user) return;
    fetchObservations();
    const sub = supabase
      .channel('observations-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'observations', filter: `user_id=eq.${user.id}` },
        () => {
          fetchObservations();
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(sub);
    };
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
    const { error } = await supabase.from('observations').insert([{ title, description }]);
    if (error) setError(error.message);
    setOptimisticObs((prev) => prev.filter((o) => o.id !== tempId));
    // fetchObservations(); // Will be handled by realtime
  }

  // Optimistic delete
  async function handleDelete(id: string) {
    setError(null);
    setOptimisticObs((prev) => prev.filter((o) => o.id !== id));
    setObservations((prev) => prev.filter((o) => o.id !== id));
    const { error } = await supabase.from('observations').delete().eq('id', id);
    if (error) setError(error.message);
    // fetchObservations(); // Will be handled by realtime
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
