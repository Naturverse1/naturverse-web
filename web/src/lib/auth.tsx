import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getSupabase } from "@/lib/supabaseClient";

export function useSession() {
  const supabase = getSupabase();
  const [session, setSession] = React.useState<Awaited<ReturnType<NonNullable<typeof supabase>['auth']['getSession']>>["data"]["session"] | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!supabase) { setLoading(false); return; }
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (mounted) {
        setSession(data.session ?? null);
        setLoading(false);
      }
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, [supabase]);
  return { session, loading };
}

export const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { session, loading } = useSession();
  const location = useLocation();
  if (loading) return null;
  if (!session) return <Navigate to="/login" state={{ from: location }} replace />;
  return <>{children}</>;
};
