import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabase } from '../lib/useSupabase';

export default function AuthCallback() {
  const navigate = useNavigate();
  const supabase = useSupabase();

  useEffect(() => {
    (async () => {
      // PKCE/code exchange (Supabase handles both OAuth & Magic)
      if (supabase) {
        const { error } = await supabase.auth.exchangeCodeForSession(window.location.href);
        if (error) console.error('Auth callback error:', error);
      }
      navigate('/', { replace: true });
    })();
  }, [navigate, supabase]);

  return <div style={{ padding: 24 }}>Signing you in…</div>;
}
