import type { SupabaseClient } from '@supabase/supabase-js';
import { supabase } from './supabaseClient';

export function getSupabase(): SupabaseClient | null {
  const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
  if (!url || !anon) return null;
  return supabase;
}

export { supabase };
