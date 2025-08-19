import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url  = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/** Returns a real client if env is present, otherwise undefined (never throws). */
export function getSupabase(): SupabaseClient | undefined {
  if (!url || !anon) return undefined;
  return createClient(url, anon);
}

/** Optional: tiny no-op helpers so callers don’t crash when env is missing. */
export const SafeSupabase = {
  from: () => ({
    select: async () => ({ data: [], error: null }),
    insert: async () => ({ data: null, error: null }),
    upsert: async () => ({ data: null, error: null }),
  }),
  auth: {
    getSession: async () => ({ data: { session: null }, error: null }),
    signInWithOAuth: async () => ({ data: null, error: null }),
    signOut: async () => ({ error: null }),
  },
} as const;
