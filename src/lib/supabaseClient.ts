import type { SupabaseClient } from '@supabase/supabase-js';

import { getBrowserClient } from './supabase/browser';

export const supabase: SupabaseClient = getBrowserClient();

export { getBrowserClient };
