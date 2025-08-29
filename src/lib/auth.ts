import { createClient } from '@supabase/supabase-js';
import { CAN_SIGN_IN, SUPABASE_URL, SUPABASE_ANON_KEY } from './env';

export function getSupabase() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    // In previews we allow the app to render without crashing
    console.warn('[naturverse] Supabase env missing; auth disabled for this build.');
    return null;
  }
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

export async function signInWithGoogle() {
  if (!CAN_SIGN_IN) return { error: new Error('Sign-in disabled for preview build') };
  const sb = getSupabase();
  if (!sb) return { error: new Error('Supabase unavailable in this build') };

  // remember where the user was on this host
  const returnTo =
    window.location.pathname +
    (window.location.search || '') +
    (window.location.hash || '');
  localStorage.setItem('returnTo', returnTo);

  // Redirect back to current host, works for prod & previews.
  const redirectTo = `${window.location.origin}/auth/callback`;
  return sb.auth.signInWithOAuth({ provider: 'google', options: { redirectTo } });
}

export async function sendMagicLink(email: string) {
  if (!CAN_SIGN_IN) return { error: new Error('Sign-in disabled for preview build') };
  const sb = getSupabase();
  if (!sb) return { error: new Error('Supabase unavailable in this build') };
  const redirectTo = `${window.location.origin}/auth/callback`;
  return sb.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: redirectTo },
  });
}

export async function getUser() {
  const sb = getSupabase();
  if (!sb) return null;
  const { data } = await sb.auth.getUser();
  return data.user;
}

export async function signOut() {
  const sb = getSupabase();
  if (!sb) return;
  await sb.auth.signOut();
}
