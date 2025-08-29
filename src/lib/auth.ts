import { createClient } from '@supabase/supabase-js';
import {
  VITE_SUPABASE_URL,
  VITE_SUPABASE_ANON_KEY,
  VITE_ALLOW_PREVIEW_SIGNIN,
  isPreviewHost,
  currentOrigin,
} from './env';

export const supabase = createClient(VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, {
  auth: { persistSession: true, detectSessionInUrl: true }
});

export const getSupabase = () => supabase;

// Build a redirect that matches the host we’re actually on (preview or prod)
const oauthRedirect = () => `${currentOrigin()}/auth/callback`;

export async function signInWithGoogle() {
  // old behavior was: if (host ends with netlify.app) alert(...); return;
  // New: respect the kill-switch only.
  if (isPreviewHost() && !VITE_ALLOW_PREVIEW_SIGNIN) {
    alert('Sign-in is disabled for previews on this site.');
    return;
  }
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: oauthRedirect() }
  });
  if (error) console.error('[auth] google sign-in error', error);
}

export async function sendMagicLink(email: string) {
  return supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: oauthRedirect() },
  });
}

export async function getUser() {
  const { data } = await supabase.auth.getUser();
  return data.user;
}

export async function signOut() {
  await supabase.auth.signOut();
}
