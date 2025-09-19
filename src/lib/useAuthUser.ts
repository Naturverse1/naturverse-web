import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export function useAuthUser() {
  const [user, setUser] = useState<null | { id: string; email?: string | null }>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!active) return;
      setUser(data.user ? { id: data.user.id, email: data.user.email } : null);
      setLoading(false);
    })();

    const { data: sub } = supabase.auth.onAuthStateChange(async () => {
      setLoading(true);
      const { data } = await supabase.auth.getUser();
      if (!active) return;
      setUser(data.user ? { id: data.user.id, email: data.user.email } : null);
      setLoading(false);
    });

    return () => {
      active = false;
      sub?.subscription?.unsubscribe();
    };
  }, []);

  return { user, loading };
}
