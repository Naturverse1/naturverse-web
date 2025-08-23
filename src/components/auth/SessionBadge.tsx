// Tiny status chip you can drop in the header later
import { useEffect, useState } from 'react';
import { getUser, signOut } from '../../lib/auth';
import './auth.css';

export default function SessionBadge() {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    getUser()
      .then((u) => setEmail(u?.email ?? null))
      .catch(() => setEmail(null));
  }, []);

  if (!email) return null;

  return (
    <div className="nv-session-chip" title={email}>
      <span className="nv-session-dot" />
      <span className="nv-session-email">{email}</span>
      <button className="nv-session-out" onClick={() => signOut().then(() => location.reload())}>
        Sign out
      </button>
    </div>
  );
}
