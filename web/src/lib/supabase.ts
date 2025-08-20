import { createClient } from '@supabase/supabase-js';

// Uses client-safe envs. Do not expose service role here.
const url = import.meta.env.VITE_SUPABASE_URL as string;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(url, anon, {
  auth: { persistSession: true, autoRefreshToken: true }
});
