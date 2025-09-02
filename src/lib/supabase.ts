import { createClient } from '@supabase/supabase-js';

const url =
  (import.meta as any).env?.VITE_SUPABASE_URL ??
  (import.meta as any).env?.PUBLIC_SUPABASE_URL ??
  (typeof process !== 'undefined' ? process.env.VITE_SUPABASE_URL : undefined) ??
  (typeof process !== 'undefined' ? process.env.PUBLIC_SUPABASE_URL : undefined);

const anon =
  (import.meta as any).env?.VITE_SUPABASE_ANON_KEY ??
  (import.meta as any).env?.PUBLIC_SUPABASE_ANON_KEY ??
  (typeof process !== 'undefined' ? process.env.VITE_SUPABASE_ANON_KEY : undefined) ??
  (typeof process !== 'undefined' ? process.env.PUBLIC_SUPABASE_ANON_KEY : undefined);

if (!url || !anon) {
  // Fail loudly in preview if misconfigured
  console.warn('Supabase env vars missing. Expected VITE_SUPABASE_URL/ANON_KEY or PUBLIC_SUPABASE_*');
}

export const supabase = createClient(url!, anon!, { auth: { persistSession: true } });
