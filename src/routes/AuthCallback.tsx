import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase-client';

/**
 * Minimal OAuth callback finisher.
 * - Lets Supabase pick the session from the URL hash
 * - Sends the user home when ready
 * - If no session, bounces them to / (where they can try again)
 */
export default function AuthCallback() {
  const navigate = useNavigate();
  // Touching search params ensures React Router doesn't treat this as static
  useSearchParams();

  useEffect(() => {
    let mounted = true;
    // Give Supabase a tick to hydrate from the hash
    const timer = setTimeout(async () => {
      const { data, error } = await supabase.auth.getSession();
      if (!mounted) return;
      if (data?.session && !error) {
        navigate('/', { replace: true });
      } else {
        // fallback – the shell will show the "Continue with Google" button
        navigate('/', { replace: true });
      }
    }, 0);
    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, [navigate]);

  return (
    <main style={{ padding: 24 }}>
      <h1>Signing you in…</h1>
      <p>If this takes more than a couple seconds, refresh the page.</p>
    </main>
  );
}
