export const VITE_SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
export const VITE_SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
export const HAS_SUPABASE_ENV = Boolean(VITE_SUPABASE_URL && VITE_SUPABASE_ANON_KEY);
