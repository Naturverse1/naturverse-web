import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase-client';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      // PKCE/code exchange (Supabase handles both OAuth & Magic)
      const { error } = await supabase.auth.exchangeCodeForSession(window.location.href);
      if (error) console.error('Auth callback error:', error);
      navigate('/', { replace: true });
    })();
  }, [navigate]);

  return <div style={{ padding: 24 }}>Signing you in…</div>;
}
