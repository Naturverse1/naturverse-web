import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase-client';

export default function AuthComplete() {
  const [msg, setMsg] = useState('Finalizing sign-in…');

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        // Supabase will set the session on this page load.
        // Poll briefly until the session exists (usually immediate).
        const t0 = Date.now();
        while (Date.now() - t0 < 4000) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session) break;
          await new Promise(r => setTimeout(r, 100));
        }

        const params = new URLSearchParams(window.location.search);
        const ret = params.get('return');

        // Fallback to home if no return given.
        const target = ret || '/';
        setMsg('Redirecting…');
        window.location.replace(target);
      } catch (e) {
        console.error('[auth/complete] relay failed:', e);
        setMsg('Signed in. You can close this tab and return to your previous page.');
      }
    }

    run();
    return () => { cancelled = true; };
  }, []);

  return (
    <main style={{maxWidth:600, margin:'4rem auto', textAlign:'center'}}>
      <h1>Welcome back 👋</h1>
      <p>{msg}</p>
    </main>
  );
}
