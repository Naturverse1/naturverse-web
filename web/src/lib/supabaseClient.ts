import { createClient, SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabase: SupabaseClient | null = null;

if (!url || !anon) {
  // Don’t throw at runtime—log and let the UI show a friendly error.
  console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY');
} else {
  supabase = createClient(url, anon);
}

export default supabase;
