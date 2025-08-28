import { createClient } from '@supabase/supabase-js';
import { VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, HAS_SUPABASE_ENV } from './env';

export const supabase =
  HAS_SUPABASE_ENV ? createClient(VITE_SUPABASE_URL!, VITE_SUPABASE_ANON_KEY!) : null;
