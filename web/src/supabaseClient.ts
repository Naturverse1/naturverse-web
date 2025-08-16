import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;

declare global {
  // eslint-disable-next-line no-var
  var __supabase: ReturnType<typeof createClient> | undefined;
}

export const supabase =
  globalThis.__supabase ??
  (globalThis.__supabase = createClient(supabaseUrl, supabaseAnonKey));
