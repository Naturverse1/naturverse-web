import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import supabase from "@/lib/supabaseClient";

if (!supabase) throw new Error('Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Netlify.');

export function useSession() {
  const [session, setSession] = React.useState<Awaited<ReturnType<NonNullable<typeof supabase>['auth']['getSession']>>["data"]["session"] | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
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
  }, []);
  return { session, loading };
}

export const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { session, loading } = useSession();
  const location = useLocation();
  if (loading) return null;
  if (!session) return <Navigate to="/login" state={{ from: location }} replace />;
  return <>{children}</>;
};
