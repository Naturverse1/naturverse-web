import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL!;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY!;

// Use globalThis to ensure singleton across HMR and environments
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
        storageKey: 'naturverse-auth',
      },
    });
  }
  return globalThis._supabase;
};

export const supabase = getSupabase();

// Attach a singleton auth state change listener (no-op by default, ready for global handling)
let _authListenerSubscribed = false;
if (!_authListenerSubscribed) {
  supabase.auth.onAuthStateChange((_event, _session) => {
    // You can add global auth logic here if needed
    // e.g., sync user state, analytics, etc.
  });
  _authListenerSubscribed = true;
}
