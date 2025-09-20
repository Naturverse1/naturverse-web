import { createClient, type SupabaseClient } from '@supabase/supabase-js';

declare global {
  // eslint-disable-next-line no-var
  var __naturverseBrowserSupabase: SupabaseClient | undefined;
}

export function getBrowserClient(): SupabaseClient {
  if (!globalThis.__naturverseBrowserSupabase) {
    const url = import.meta.env.VITE_SUPABASE_URL;
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!url || !key) {
      throw new Error('Missing Supabase environment variables.');
    }

    globalThis.__naturverseBrowserSupabase = createClient(url, key, {
      auth: {
        persistSession: true,
        detectSessionInUrl: true,
      },
    });
  }

  return globalThis.__naturverseBrowserSupabase;
}
