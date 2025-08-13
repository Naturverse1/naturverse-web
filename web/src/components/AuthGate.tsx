import { useEffect, useState } from 'react';
// ...existing code...

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      const fetchUser = async () => {
        const user_id = localStorage.getItem('user_id');
        if (!user_id) {
          setUser(null);
          setLoading(false);
          return;
        }
        const res = await fetch(`/functions/user?user_id=${user_id}`);
        const json = await res.json();
        if (json.data) setUser(json.data);
        else setUser(null);
        setLoading(false);
      };
      fetchUser();
      const onStorage = () => fetchUser();
      window.addEventListener('storage', onStorage);
      return () => {
        window.removeEventListener('storage', onStorage);
      };
    }, []);

  // Demo: Use /functions/auth for sign in/up, and /functions/logout for sign out
  const signInWithEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch('/functions/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: 'password', type: 'signIn' }),
      });
      const json = await res.json();
      if (json.error) setError(json.error);
      else {
        // Save user_id to localStorage for demo session
        localStorage.setItem('user_id', json.data.user.id);
        window.dispatchEvent(new Event('storage'));
      }
    } catch (e) {
      setError('Failed to sign in');
    }
  };

  const signOut = async () => {
    setError(null);
    try {
      await fetch('/functions/logout', { method: 'POST' });
      localStorage.removeItem('user_id');
      window.dispatchEvent(new Event('storage'));
    } catch (e) {
      setError('Failed to sign out');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!user) {
    return (
      <div style={{ maxWidth: 320, margin: '2rem auto', padding: 16, border: '1px solid #ccc', borderRadius: 8 }}>
        <h2>Sign in</h2>
        {/* Google sign-in omitted in demo */}
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
