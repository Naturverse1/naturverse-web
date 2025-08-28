import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!url || !anon) {
  // Fail loud in console but don't crash the whole app UI
  console.error('[supabase] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY');
}

export const supabase = createClient(url ?? '', anon ?? '', {
  auth: {
    persistSession: true,
    detectSessionInUrl: true, // allow PKCE callback handling
    flowType: 'pkce',
    autoRefreshToken: true,
  },
});
