import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!,
  { auth: { persistSession: true, autoRefreshToken: true } }
);

export function getSupabase() {
  return supabase;
}

export async function handleAuthCallback() {
  if (location.pathname !== '/auth/callback') return;
  await supabase.auth.getSessionFromUrl({ storeSession: true }).catch(() => {});
  history.replaceState({}, '', '/');
}
