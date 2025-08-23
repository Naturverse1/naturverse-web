import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../auth/AuthContext';

export default function ProfileForm() {
  const { user } = useAuth();
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', user.id)
        .single();
      if (data?.username) setUsername(data.username);
    })();
  }, [user]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    const { error } = await supabase
      .from('profiles')
      .update({ username, updated_at: new Date().toISOString() })
      .eq('id', user.id);
    setLoading(false);
    if (error) alert(error.message);
    else alert('✅ Saved!');
  }

  if (!user) return null;

  return (
    <form onSubmit={save} style={{ maxWidth: 400, margin: '1rem auto' }}>
      <h2>Profile</h2>
      <label style={{ display: 'block', margin: '8px 0 4px' }}>Username</label>
      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder='Your name'
        style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #ccc' }}
      />
      <button
        type='submit'
        disabled={loading}
        style={{
          marginTop: 12,
          padding: '8px 14px',
          borderRadius: 8,
          border: 0,
          background: '#2f7ae5',
          color: '#fff',
          fontWeight: 700,
        }}
      >
        {loading ? 'Saving...' : 'Save'}
      </button>
    </form>
  );
}
