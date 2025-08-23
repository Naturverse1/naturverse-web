import { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import AuthModal from './AuthModal';

export default function AccountButton() {
  const { user, signOut, loading } = useAuth();
  const [open, setOpen] = useState(false);

  if (loading) return null;

  if (!user) {
    return (
      <>
        <button onClick={() => setOpen(true)} style={btn}>
          Create account / Sign in
        </button>
        <AuthModal open={open} onClose={() => setOpen(false)} />
      </>
    );
  }

  const name = user.user_metadata?.name || user.email?.split('@')[0] || 'Explorer';
  return (
    <div style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}>
      <span style={{ fontWeight: 700 }}>{name}</span>
      <button onClick={signOut} style={btnSecondary}>Sign out</button>
    </div>
  );
}

const btn: React.CSSProperties = {
  padding: '8px 12px',
  borderRadius: 10,
  border: 0,
  background: '#2f7ae5',
  color: '#fff',
  fontWeight: 700,
  cursor: 'pointer',
};
const btnSecondary: React.CSSProperties = {
  padding: '8px 12px',
  borderRadius: 10,
  border: '1px solid #94a3b8',
  background: '#fff',
  color: '#0f172a',
  fontWeight: 700,
  cursor: 'pointer',
};

