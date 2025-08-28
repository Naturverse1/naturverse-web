'use client';
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!,
);

export default function AuthButtons() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function sendMagicLink(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${location.origin}/auth/callback` }
    });
    setLoading(false);
    if (!error) setSent(true);
    else alert(error.message);
  }

  async function signInGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${location.origin}/auth/callback` }
    });
  }

  return (
    <div className="card" style={{ maxWidth: 560 }}>
      <h3>Sign in or create an account</h3>

      <form onSubmit={sendMagicLink} style={{ display: 'grid', gap: 12 }}>
        <label className="sr-only" htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button className="btn" type="submit" disabled={loading || sent}>
          {sent ? 'Check your email ✉️' : loading ? 'Sending…' : 'Send magic link'}
        </button>
      </form>

      <div style={{ display: 'grid', gap: 8, marginTop: 12 }}>
        <button className="btn" onClick={signInGoogle}>Continue with Google</button>
        <a className="link" href="/worlds">Continue as guest</a>
        <small>By continuing you agree to our <a href="/terms">Terms</a> and <a href="/privacy">Privacy</a>.</small>
      </div>
    </div>
  );
}

