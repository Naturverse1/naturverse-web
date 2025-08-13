import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      setLoading(false);
    };
    getUser();
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
    if (error) setError(error.message);
  };

  const signInWithEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) setError(error.message);
  };

  const signOut = async () => {
    setError(null);
    await supabase.auth.signOut();
  };

  if (loading) return <div>Loading...</div>;
  if (!user) {
    return (
      <div style={{ maxWidth: 320, margin: '2rem auto', padding: 16, border: '1px solid #ccc', borderRadius: 8 }}>
        <h2>Sign in</h2>
        <button onClick={signInWithGoogle} style={{ width: '100%', marginBottom: 8 }}>Sign in with Google</button>
        <form onSubmit={signInWithEmail} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={{ padding: 8 }}
          />
          <button type="submit">Sign in with Email</button>
        </form>
        {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
      </div>
    );
  }
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <span>{user.email}</span>
        <button onClick={signOut}>Sign out</button>
      </div>
      {children}
    </div>
  );
}
