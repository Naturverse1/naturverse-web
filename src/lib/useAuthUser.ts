import { useEffect, useState } from 'react';
import { useSupabase } from '@/lib/useSupabase';

export function useAuthUser() {
  const supabase = useSupabase();
  const [user, setUser] = useState<null | { id: string; email?: string | null }>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    if (!supabase) {
      setLoading(false);
      return;
    }

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
  }, [supabase]);

  return { user, loading };
}
