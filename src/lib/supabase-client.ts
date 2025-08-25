import { createClient as createSupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export function createClient() {
  return createSupabaseClient(supabaseUrl, supabaseAnonKey);
}

export const supabase = createClient();
