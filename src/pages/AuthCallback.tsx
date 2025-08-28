import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function AuthCallback() {
  const [msg, setMsg] = useState('Finishing sign-in…');

  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await supabase.auth.exchangeCodeForSession(window.location.href);
        if (error) throw error;
        const dest = sessionStorage.getItem('post-auth-redirect') || '/';
        sessionStorage.removeItem('post-auth-redirect');
        window.location.replace(dest);
      } catch (e) {
        console.error('[auth] exchangeCodeForSession failed', e);
        setMsg('Could not finish sign-in. Please try again.');
      }
    })();
  }, []);

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>{msg}</h2>
    </div>
  );
}
