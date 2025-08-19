import { createClient } from '@supabase/supabase-js'

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || (typeof window !== 'undefined' ? (window as any).ENV?.VITE_SUPABASE_URL : '')
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY || (typeof window !== 'undefined' ? (window as any).ENV?.VITE_SUPABASE_ANON_KEY : '')

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
