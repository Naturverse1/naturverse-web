import { createClient } from '@supabase/supabase-js'

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || import.meta.env.SUPABASE_URL
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  // Don’t crash build; app will show empty states if envs are missing
  console.warn('Supabase env vars are missing at build time')
}

export const supabase = createClient(supabaseUrl ?? '', supabaseAnonKey ?? '')
