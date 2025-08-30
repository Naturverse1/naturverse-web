import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase-client';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        // Handle both PKCE and implicit flows gracefully
        // Newer SDK:
        // await supabase.auth.exchangeCodeForSession(window.location.href);
        // Older / hash-based:
        // @ts-ignore - if method isn't present, fall back
        const anyAuth: any = supabase.auth;
        if (typeof anyAuth.exchangeCodeForSession === 'function') {
          await anyAuth.exchangeCodeForSession(window.location.href);
        } else if (typeof anyAuth.getSessionFromUrl === 'function') {
          await anyAuth.getSessionFromUrl({ storeSession: true });
        }
      } catch {
        // ignore — we'll still take user home
      } finally {
        navigate('/', { replace: true });
      }
    })();
  }, [navigate]);

  return <div style={{ padding: 24 }}>Signing you in…</div>;
}

