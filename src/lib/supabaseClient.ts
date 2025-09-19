import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables.');
}

type NaturverseGlobal = typeof globalThis & {
  __naturverseSupabase?: SupabaseClient;
};

const globalRef = globalThis as NaturverseGlobal;

export const supabase: SupabaseClient =
  globalRef.__naturverseSupabase ??
  (globalRef.__naturverseSupabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      detectSessionInUrl: true,
    },
  }));
