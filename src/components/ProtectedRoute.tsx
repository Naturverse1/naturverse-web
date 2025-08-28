import { ComponentType, useEffect, useState } from 'react';
import { useSupabase } from '@/lib/useSupabase';

type Props = { component: ComponentType<any> };

export default function ProtectedRoute({ component: C }: Props) {
  const [ok, setOk] = useState<boolean | null>(null);
  const supabase = useSupabase();

  useEffect(() => {
    let on = true;
    (async () => {
      if (!supabase) { setOk(false); return; }
      const { data } = await supabase.auth.getSession();
      if (!on) return;
      if (data.session) {
        setOk(true);
      } else {
        try {
          sessionStorage.setItem('naturverse.returnTo', window.location.pathname + window.location.search);
        } catch {}
        setOk(false);
      }
    })();
    return () => {
      on = false;
    };
  }, [supabase]);

  if (ok === null) return null;

  return ok ? <C /> : <UnauthedFallback />;
}

function UnauthedFallback() {
  return (
    <div className="guard">
      <h1>Sign in required</h1>
      <p className="muted">Please sign in to access this page.</p>
      <div className="row">
        <a className="btn" href="/login">
          Sign in
        </a>
        <a className="btn outline" href="/">
          Back home
        </a>
      </div>
    </div>
  );
}

