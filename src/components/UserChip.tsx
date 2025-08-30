import { useState, useRef, useEffect } from 'react';
import { useSupabase } from '@/lib/useSupabase';
import LazyImg from './LazyImg';
import { signOut } from '@/lib/auth';

export default function UserChip({ email }: { email?: string | null }) {
  const supabase = useSupabase();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="btn"
        style={{ display: 'inline-flex', alignItems: 'center', gap: 8, paddingInline: 10 }}
      >
        <LazyImg
          src="/favicon.svg"
          alt="Avatar"
          width={20}
          height={20}
          style={{ borderRadius: 6, background: '#eef3ff' }}
        />
        <span style={{ maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {email ?? 'Account'}
        </span>
      </button>

      {open && (
        <div
          role="menu"
          style={{
            position: 'absolute',
            right: 0,
            marginTop: 8,
            background: 'white',
            border: '1px solid #dbe2f0',
            borderRadius: 10,
            minWidth: 180,
            boxShadow: '0 4px 16px rgba(2,16,64,0.08)',
            zIndex: 20,
          }}
        >
          <a role="menuitem" href="/profile" className="btn" style={menuItem}>
            Profile
          </a>
          <button
            role="menuitem"
            onClick={async () => {
              await signOut();
            }}
            className="btn"
            style={menuItem}
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}

const menuItem: React.CSSProperties = {
  display: 'block',
  width: '100%',
  textAlign: 'left',
  padding: '10px 12px',
  border: 'none',
  background: 'transparent',
};
