import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

let _supabase: SupabaseClient | null = null;

if (url && anon) {
  _supabase = createClient(url, anon, {
    auth: {
      persistSession: true,
      detectSessionInUrl: true,
      flowType: 'pkce',
      autoRefreshToken: true,
    },
  });
} else {
  // Don't throw—just run in "no-auth" mode so previews/permalinks load.
  // You’ll still see this warning in console so we notice quickly.
  console.warn('[supabase] VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY missing. Auth disabled.');
}

export const supabase = _supabase;
export const hasSupabase = () => _supabase !== null;
