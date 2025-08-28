import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

// If running on preview and no env, return a no-op client
export const supabase =
  url && key
    ? createClient(url, key)
    : { from: () => ({ select: async () => ({ data: [], error: null }) }) } as any;
