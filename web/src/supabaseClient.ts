import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL!;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY!;

// Use globalThis to ensure singleton across HMR and environments
const storageKey = 'naturverse-auth';
type SupabaseClientType = ReturnType<typeof createClient>;
declare global {
  // eslint-disable-next-line no-var
  var _supabase: SupabaseClientType | undefined;
}

const getSupabase = () => {
  if (!globalThis._supabase) {
    globalThis._supabase = createClient(url, anon, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey,
      },
    });
  }
  return globalThis._supabase;
};

export const supabase = getSupabase();

// Attach a singleton auth state change listener for sign-in state
let _authListenerSubscribed = false;
if (!_authListenerSubscribed) {
  supabase.auth.onAuthStateChange((_event, session) => {
    if (session) localStorage.setItem(storageKey, '1');
    else localStorage.removeItem(storageKey);
  });
  _authListenerSubscribed = true;
}
