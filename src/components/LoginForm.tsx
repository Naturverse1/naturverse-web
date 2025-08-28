import { useEffect, useState } from 'react';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';
import { useSupabase } from '@/lib/useSupabase';

type Status = 'idle' | 'sending' | 'sent' | 'error';

export default function LoginForm() {
  const supabase = useSupabase();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState<string | null>(null);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    let mounted = true;

    if (!supabase) return;
    // Load initial session
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session ?? null);
    });

    // Subscribe to auth state changes
    const { data: sub } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, newSession) => {
      setSession(newSession);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, [supabase]);

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !supabase) return;
    setStatus('sending');
    setMessage(null);
    try {
      sessionStorage.setItem('postAuthRedirect', window.location.pathname + window.location.search);
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: window.location.origin,
        },
      });
      if (error) throw error;
      setStatus('sent');
      setMessage('Magic link sent! Check your email.');
    } catch (err: any) {
      setStatus('error');
      setMessage(err?.message ?? 'Something went wrong.');
    }
  }

  async function signInWithGoogle() {
    if (!supabase) return;
    setStatus('sending');
    setMessage(null);
    try {
      sessionStorage.setItem('postAuthRedirect', window.location.pathname + window.location.search);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin },
      });
      if (error) throw error;
      setStatus('idle');
    } catch (err: any) {
      setStatus('error');
      setMessage(err?.message ?? 'OAuth sign-in failed.');
    }
  }

  async function handleLogout() {
    if (!supabase) return;
    await supabase.auth.signOut();
    setMessage('Signed out.');
  }

  if (session) {
    const email = session.user.email ?? 'Signed in';
    return (
      <div className="card">
        <h2>Welcome</h2>
        <p>{email}</p>
        <button onClick={handleLogout}>Log out</button>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>Sign in</h2>

      <form onSubmit={handleEmailLogin} style={{ marginBottom: 16 }}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending...' : 'Send magic link'}
        </button>
      </form>

      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={signInWithGoogle} aria-label="Sign in with Google">
          Continue with Google
        </button>
      </div>

      {message && (
        <p style={{ marginTop: 12, fontWeight: 600 }}>
          {status === 'error' ? '⚠️ ' : '✅ '}
          {message}
        </p>
      )}
    </div>
  );
}
