import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
  if (!url || !anon) return null;

  if (!client) {
    client = createClient(url, anon, { auth: { persistSession: false } });
  }
  return client;
}

// Legacy default export for modules that expect a client immediately
export const supabase = getSupabase();

