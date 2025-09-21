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

let browserClient: SupabaseClient | null = globalRef.__naturverseSupabase ?? null;

export function getSupabase(): SupabaseClient {
  if (browserClient) return browserClient;

  const storage = typeof window !== 'undefined' ? window.localStorage : undefined;

  browserClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storage,
    },
  });

  globalRef.__naturverseSupabase = browserClient;

  return browserClient;
}

export const supabase: SupabaseClient = getSupabase();
