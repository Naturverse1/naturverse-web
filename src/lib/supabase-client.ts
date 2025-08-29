import { createClient } from '@supabase/supabase-js';
import { buildProdFinishUrl, currentUrl } from './auth';

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!,
  { auth: { persistSession: true, detectSessionInUrl: true } }
);

export function getSupabase() {
  return supabase;
}

export async function signInWithGoogle() {
  // Always finish on prod; include the current page as the return target.
  const redirectTo = buildProdFinishUrl(currentUrl());
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo }
  });
  if (error) console.error('[auth] google sign-in error:', error);
}
