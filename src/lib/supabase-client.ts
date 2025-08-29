import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { buildProdFinishUrl, currentUrl } from './auth';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

let supabase: SupabaseClient | null = null;

if (url && anon) {
  supabase = createClient(url, anon, {
    auth: { persistSession: true, detectSessionInUrl: true },
  });
} else {
  console.warn('[supabase] Missing URL or anon key — auth disabled in this build.');
}

export function getSupabase() {
  return supabase;
}

export async function signInWithGoogle() {
  if (!supabase) {
    alert('Sign-in is unavailable in this preview. Please use production.');
    return;
  }
  // Always finish on prod; include the current page as the return target.
  const redirectTo = buildProdFinishUrl(currentUrl());
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo },
  });
  if (error) console.error('[auth] google sign-in error:', error);
}

export { supabase };
