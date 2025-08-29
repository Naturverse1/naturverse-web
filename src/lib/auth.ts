import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase =
  url && key
    ? createClient(url, key, {
        auth: { persistSession: true, detectSessionInUrl: true },
      })
    : null;

export function getSupabase() {
  return supabase;
}

/** Always return to the current host (preview or prod) */
export async function signInWithGoogle() {
  if (!supabase) return { data: null, error: new Error('Supabase not configured') };

  const redirectTo = `${location.origin}/auth/callback`;
  return supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo,
      queryParams: { prompt: 'consent', access_type: 'offline' },
    },
  });
}

export async function sendMagicLink(email: string) {
  if (!supabase) return { data: null, error: new Error('Supabase not configured') };

  const redirectTo = `${location.origin}/auth/callback`;
  return supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: redirectTo },
  });
}

export async function getUser() {
  if (!supabase) return null;
  const { data } = await supabase.auth.getUser();
  return data.user;
}

export async function signOut() {
  if (!supabase) return;
  await supabase.auth.signOut();
}
