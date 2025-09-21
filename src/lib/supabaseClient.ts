import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let _sb: SupabaseClient | null = null;

export function supabase(): SupabaseClient {
  if (_sb) return _sb;
  const url = import.meta.env.VITE_SUPABASE_URL!;
  const anon = import.meta.env.VITE_SUPABASE_ANON_KEY!;
  _sb = createClient(url, anon, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false },
  });
  return _sb!;
}

const client = supabase();
Object.assign(supabase as unknown as Record<string, unknown>, client);
export default supabase;
