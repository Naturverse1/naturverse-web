// Safe, no-crash Supabase init (avoids blank page if envs are missing)
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const supabase: SupabaseClient | null =
  url && anon ? createClient(url, anon) : null;

// Optional helper to assert availability where needed
export function requireSupabase(): SupabaseClient {
  if (!supabase) {
    throw new Error('Supabase env vars are not set (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY).');
  }
  return supabase;
}

