import { useEffect, useState } from 'react';
import { hasSupabase, supabase } from '../lib/supabaseClient';

export default function AuthCallback() {
  const [msg, setMsg] = useState('Finishing sign-in…');

  useEffect(() => {
    (async () => {
      if (!hasSupabase()) {
        // Nothing to exchange; just head home gracefully
        window.location.replace('/');
        return;
      }
      const { error } = await supabase!.auth.exchangeCodeForSession(window.location.href);
      if (error) {
        console.error('[auth] exchangeCodeForSession failed', error);
        setMsg('Could not finish sign-in. Please try again.');
        return;
      }
      const dest = sessionStorage.getItem('post-auth-redirect') || '/';
      sessionStorage.removeItem('post-auth-redirect');
      window.location.replace(dest);
    })();
  }, []);

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>{msg}</h2>
    </div>
  );
}
