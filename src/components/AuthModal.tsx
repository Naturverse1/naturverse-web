import { useState } from 'react';
import { sendMagicLink } from '../lib/auth';

type Props = { open: boolean; onClose: () => void; title?: string };

export default function AuthModal({ open, onClose, title = 'Sign in' }: Props) {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  if (!open) return null;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const { error } = await sendMagicLink(email.trim());
    if (error) setError(error.message);
    else setSent(true);
  }

  return (
    <div style={overlay}>
      <div style={card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0 }}>{title}</h3>
          <button onClick={onClose} aria-label='Close' style={xBtn}>×</button>
        </div>

        {!sent ? (
          <form onSubmit={submit} style={{ marginTop: 12 }}>
            <label style={label}>Email</label>
            <input
              type='email'
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='you@example.com'
              style={input}
            />
            {error && <p style={err}>{error}</p>}
            <button type='submit' style={primaryBtn}>Send magic link</button>
          </form>
        ) : (
          <div style={{ marginTop: 12 }}>
            <p>✅ Check your inbox for a sign-in link.</p>
            <button onClick={onClose} style={primaryBtn}>Done</button>
          </div>
        )}
      </div>
    </div>
  );
}

const overlay: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.4)',
  display: 'grid',
  placeItems: 'center',
  zIndex: 1000,
};
const card: React.CSSProperties = {
  width: 'min(92vw, 420px)',
  background: '#fff',
  borderRadius: 12,
  padding: 16,
  boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
};
const xBtn: React.CSSProperties = { background: 'transparent', border: 0, fontSize: 24, cursor: 'pointer' };
const label: React.CSSProperties = { display: 'block', fontWeight: 700, margin: '8px 0 4px' };
const input: React.CSSProperties = { width: '100%', padding: 10, borderRadius: 8, border: '1px solid #cbd5e1' };
const primaryBtn: React.CSSProperties = {
  marginTop: 12,
  padding: '10px 14px',
  borderRadius: 10,
  border: 0,
  background: '#2f7ae5',
  color: '#fff',
  fontWeight: 700,
  cursor: 'pointer',
};
const err: React.CSSProperties = { color: '#b00020', marginTop: 8 };

