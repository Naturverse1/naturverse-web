import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { OAUTH_REDIRECT } from './auth';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const supabase: SupabaseClient | null =
  url && anon
    ? createClient(url, anon, { auth: { persistSession: true, detectSessionInUrl: true } })
    : null;

export const hasSupabase = () => supabase !== null;

export function getSupabase(): SupabaseClient | null {
  return supabase;
}

export async function signInWithGoogle() {
  if (!supabase) return { data: null, error: new Error('Auth unavailable') };
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: OAUTH_REDIRECT },
  });
  if (error) console.error('[auth] google sign-in error:', error);
  return { data, error };
}

