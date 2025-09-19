import { createClient as createSupabaseClient, type SupabaseClient } from '@supabase/supabase-js';

const requireEnv = (value: string | undefined, message: string) => {
  if (!value) throw new Error(message);
  return value;
};

const supabaseUrl = requireEnv(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  'Missing Supabase environment variables. Set NEXT_PUBLIC_SUPABASE_URL.'
);
const supabaseAnonKey = requireEnv(
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  'Missing Supabase environment variables. Set NEXT_PUBLIC_SUPABASE_ANON_KEY.'
);

const globalForSupabase = globalThis as unknown as {
  __naturverseNextSupabase?: SupabaseClient;
};

export function createClient() {
  return createSupabaseClient(supabaseUrl, supabaseAnonKey);
}

export const supabase = globalForSupabase.__naturverseNextSupabase ??= createClient();
