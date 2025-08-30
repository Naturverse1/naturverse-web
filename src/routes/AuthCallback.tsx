import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase-client';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const url = new URL(window.location.href);

        // PKCE / OAuth code flow: /auth/callback?code=...
        const code = url.searchParams.get('code');
        if (code) {
          await supabase.auth.exchangeCodeForSession(window.location.href);
          navigate('/', { replace: true });
          return;
        }

        // Implicit flow: /auth/callback#access_token=...&refresh_token=...
        if (window.location.hash.includes('access_token')) {
          const hash = new URLSearchParams(window.location.hash.slice(1));
          const access_token = hash.get('access_token') || '';
          const refresh_token = hash.get('refresh_token') || '';

          if (access_token && refresh_token) {
            await supabase.auth.setSession({ access_token, refresh_token });
          }
          navigate('/', { replace: true });
          return;
        }

        // Nothing to process — just go home
        navigate('/', { replace: true });
      } catch {
        navigate('/', { replace: true });
      }
    })();
  }, [navigate]);

  return null;
}
