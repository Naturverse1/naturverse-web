import { createClient } from '@supabase/supabase-js';
import { getEnv } from './env';

const { SUPABASE_URL, SUPABASE_ANON_KEY } = getEnv();

export const supabase =
  SUPABASE_URL && SUPABASE_ANON_KEY
    ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    : null; // avoid throwing; caller must handle null
