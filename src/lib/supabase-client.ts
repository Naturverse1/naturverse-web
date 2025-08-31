import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
)

export function getSupabase() {
  return supabase
}

// Handle /auth/callback with hash tokens (implicit flow)
export async function handleAuthCallback() {
  if (location.pathname !== '/auth/callback') return
  await supabase.auth.getSessionFromUrl({ storeSession: true }).catch(() => {})
  history.replaceState({}, '', '/')
}
