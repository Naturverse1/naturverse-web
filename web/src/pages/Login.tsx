import { useState } from 'react';
import { supabase } from '@/supabaseClient';

export default function Login() {
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setMessage(null);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/app` },
    });
    if (error) setMessage(error.message);
    else setMessage('Check your email for the magic link.');
    setSending(false);
  };

  return (
    <main style={{ padding: '2rem' }}>
      <h1>Sign in</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 320 }}>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
        />
        <button type="submit" disabled={sending}>
          {sending ? 'Sending…' : 'Send magic link'}
        </button>
        {message && <p>{message}</p>}
      </form>
    </main>
  );
}
