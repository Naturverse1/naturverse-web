import { useEffect } from 'react';
import LoginForm from '../components/LoginForm';
import { supabase } from '@/lib/supabaseClient';

function redirectAfterLogin() {
  try {
    const dest = sessionStorage.getItem('naturverse.returnTo');
    if (dest) {
      sessionStorage.removeItem('naturverse.returnTo');
      window.location.replace(dest);
      return;
    }
  } catch {}
  window.location.replace('/profile');
}

export default function LoginPage() {
  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (mounted && data.session) redirectAfterLogin();
    })();
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) redirectAfterLogin();
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return (
    <main className="page">
      <header className="page-header">
        <h1>Login</h1>
        <p>Use a magic link or sign in with a provider.</p>
      </header>

      <LoginForm />
    </main>
  );
}
