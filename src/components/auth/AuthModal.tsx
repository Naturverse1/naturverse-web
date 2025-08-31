/* Lightweight, framework-agnostic TSX. It doesn’t mount itself.
   Import and render it where you want later. */
import { useState } from 'react';
import { sendMagicLink } from '../../lib/auth';
import './auth.css';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  successMessage?: string;
};

export default function AuthModal({
  isOpen,
  onClose,
  successMessage = 'Check your email for a sign-in link.',
}: Props) {
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  if (!isOpen) return null;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    setMsg(null);
    const { error } = await sendMagicLink(email.trim());
    if (error) setErr(error.message ?? 'Sign-in failed.');
    else setMsg(successMessage);
    setBusy(false);
  }

  return (
    <div className="nv-auth-backdrop" role="dialog" aria-modal="true">
      <div className="nv-auth-modal">
        <button className="nv-auth-close" onClick={onClose} aria-label="Close">
          ×
        </button>
        <h3>Sign in</h3>
        <p className="nv-auth-sub">Use your email to get a magic link.</p>
        <form onSubmit={onSubmit}>
          <label className="nv-auth-label">
            Email
            <input
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
              required
              className="nv-auth-input"
            />
          </label>
          <button className="nv-auth-button" disabled={busy}>
            {busy ? 'Sending…' : 'Send magic link'}
          </button>
        </form>
        {msg && <p className="nv-auth-ok">{msg}</p>}
        {err && <p className="nv-auth-err">{err}</p>}
        <p className="nv-auth-small">
          We never post without permission. One-click sign out anytime.
        </p>
      </div>
    </div>
  );
}
