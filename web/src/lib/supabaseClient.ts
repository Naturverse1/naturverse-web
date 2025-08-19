import { createClient, SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export function getSupabase(): SupabaseClient | null {
  try {
    if (!client && url && key) client = createClient(url, key);
  } catch (e) {
    console.error("[Naturverse] Supabase init failed", e);
    client = null;
  }
  return client;
}
