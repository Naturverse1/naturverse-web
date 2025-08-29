'use client';
import { useState } from 'react';
import { sendMagicLink } from '@/lib/auth';
import { signInWithGoogle } from '@/lib/auth';
import { useSupabase } from '@/lib/useSupabase';

export default function AuthButtons() {
  const supabase = useSupabase();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    if (!supabase) {
      alert('Sign-in is unavailable in this preview. Please use production.');
      return;
    }
    setLoading(true);
    const { error } = await sendMagicLink(email);
    setLoading(false);
    if (!error) setSent(true);
    else alert(error.message);
  }

  async function signInGoogle() {
    await signInWithGoogle();
  }

  return (
    <div className="card" style={{ maxWidth: 560 }}>
      <h3>Sign in or create an account</h3>

      <form onSubmit={handleMagicLink} style={{ display: 'grid', gap: 12 }}>
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
