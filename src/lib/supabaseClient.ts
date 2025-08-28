import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Guarded creation so preview/permalink builds without env don't crash.
const url = (import.meta as any)?.env?.VITE_SUPABASE_URL as string | undefined;
const key = (import.meta as any)?.env?.VITE_SUPABASE_ANON_KEY as string | undefined;

let supabase: SupabaseClient | null = null;
if (typeof url === 'string' && url && typeof key === 'string' && key) {
  supabase = createClient(url, key, {
    auth: { persistSession: false },
  });
}

export { supabase };
