import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/auth';

function parseHashFragment(hash: string) {
  const out = new URLSearchParams(hash.replace(/^#/, ''));
  return {
    access_token: out.get('access_token') || '',
    refresh_token: out.get('refresh_token') || '',
  };
}

export default function AuthCallback() {
  const nav = useNavigate();
  const [msg, setMsg] = useState('Finishing sign-in…');

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const sb = supabase;
        if (!sb) throw new Error('Supabase not configured');
        const url = new URL(window.location.href);

        // 1) Implicit flow: #access_token in the hash
        if (url.hash.includes('access_token=')) {
          const { access_token, refresh_token } = parseHashFragment(url.hash);
          if (!access_token || !refresh_token) throw new Error('Missing tokens');
          const { error } = await sb.auth.setSession({ access_token, refresh_token });
          if (error) throw error;
          nav('/', { replace: true });
          return;
        }

        // 2) PKCE / Code flow: ?code=…
        if (url.searchParams.get('code')) {
          const { error } = await sb.auth.exchangeCodeForSession(url.href);
          if (error) throw error;
          nav('/', { replace: true });
          return;
        }

        setMsg('No auth data found.');
      } catch (err) {
        console.error(err);
        if (alive) setMsg('Sign-in failed. Please try again.');
      }
    })();
    return () => {
      alive = false;
    };
  }, [nav]);

  return (
    <div style={{ padding: '4rem', textAlign: 'center' }}>
      <h1>{msg}</h1>
    </div>
  );
}

