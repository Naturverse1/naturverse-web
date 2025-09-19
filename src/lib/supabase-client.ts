import { createClient as createSupabaseClient, type SupabaseClient } from '@supabase/supabase-js';

type EnvKey =
  | 'VITE_SUPABASE_URL'
  | 'VITE_SUPABASE_ANON_KEY'
  | 'NEXT_PUBLIC_SUPABASE_URL'
  | 'NEXT_PUBLIC_SUPABASE_ANON_KEY';

const fromImportMeta = (key: EnvKey) => {
  try {
    return (import.meta.env as Record<string, string | undefined>)[key];
  } catch {
    return undefined;
  }
};

const fromProcessEnv = (key: EnvKey) => {
  return typeof process !== 'undefined' ? process.env?.[key] : undefined;
};

const resolveEnv = (primary: EnvKey, fallback: EnvKey) => {
  return fromImportMeta(primary) ?? fromImportMeta(fallback) ?? fromProcessEnv(primary) ?? fromProcessEnv(fallback);
};

const requireEnv = (value: string | undefined, message: string) => {
  if (!value) throw new Error(message);
  return value;
};

const supabaseUrl = requireEnv(
  resolveEnv('VITE_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_URL'),
  'Missing Supabase environment variables. Set VITE_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL.'
);
const supabaseAnonKey = requireEnv(
  resolveEnv('VITE_SUPABASE_ANON_KEY', 'NEXT_PUBLIC_SUPABASE_ANON_KEY'),
  'Missing Supabase environment variables. Set VITE_SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY.'
);

const globalForSupabase = globalThis as unknown as {
  __naturverseSupabase?: SupabaseClient;
};

export function createClient() {
  return createSupabaseClient(supabaseUrl, supabaseAnonKey);
}

export const supabase = globalForSupabase.__naturverseSupabase ??= createClient();
