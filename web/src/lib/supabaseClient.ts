import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { env, warnIfMissingEnv } from "./env";

warnIfMissingEnv();

// If env is missing in production, don't explode at import-time.
// Provide a proxy that throws ONLY when used, so the app can still render.
let supabase: SupabaseClient;

if (env.supabaseUrl && env.supabaseAnonKey) {
  supabase = createClient(env.supabaseUrl, env.supabaseAnonKey);
} else {
  supabase = new Proxy({} as SupabaseClient, {
    get() {
      throw new Error(
        "Supabase is not configured. Verify VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY on Netlify."
      );
    }
  }) as SupabaseClient;
}

export { supabase };
