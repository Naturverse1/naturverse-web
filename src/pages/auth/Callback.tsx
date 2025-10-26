import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getSupabase } from '@/lib/supabaseClient';
import { DEFAULT_REDIRECT_PATH, resolveRedirectPath } from '@/lib/auth';

export default function AuthCallback() {
  const supabase = getSupabase();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const once = useRef(false);

  useEffect(() => {
    if (once.current) return;
    once.current = true;

    (async () => {
      try {
        sessionStorage.setItem('lastAuthCallbackAt', String(Date.now()));
      } catch {
        // ignore sessionStorage failures
      }

      const { error } = await supabase.auth.exchangeCodeForSession(window.location.href);
      if (error) {
        console.error('Auth exchange error:', error);
        navigate('/login', { replace: true });
        return;
      }

      let storedNext: string | null = null;
      try {
        const legacy =
          sessionStorage.getItem('postAuthRedirect') ??
          sessionStorage.getItem('naturverse.returnTo');
        storedNext = legacy;
        sessionStorage.removeItem('postAuthRedirect');
        sessionStorage.removeItem('naturverse.returnTo');
      } catch {
        storedNext = null;
      }

      const nextParam = params.get('next');
      const target = resolveRedirectPath(nextParam ?? storedNext, DEFAULT_REDIRECT_PATH);
      navigate(target, { replace: true });
    })();
  }, [navigate, params, supabase]);

  return (
    <main className="page-pad">
      <p>Signing you in…</p>
    </main>
  );
}
