import { hasSupabase, supabase } from './supabaseClient';

export { supabase };

const PROD_ORIGIN = 'https://thenaturverse.com'; // kept for reference/other links

/**
 * Allow auth on the current host?
 * - Always allow on production
 * - Allow on *.netlify.app only when VITE_ALLOW_PREVIEW_AUTH === 'true'
 */
export function authAllowedHere(): boolean {
  if (!hasSupabase()) return false;
  const allowPreview = import.meta.env.VITE_ALLOW_PREVIEW_AUTH === 'true';
  const isNetlifyPreview =
    typeof location !== 'undefined' && location.hostname.endsWith('.netlify.app');
  return isNetlifyPreview ? allowPreview : true;
}

export async function signInWithGoogle() {
  if (!authAllowedHere()) {
    alert('Sign-in is unavailable in this preview.');
    return;
  }
  return supabase!.auth.signInWithOAuth({
    provider: 'google',
    // Send the user back to whichever origin they started on (prod or preview)
    options: { redirectTo: `${location.origin}/auth/callback` },
  });
}

export async function sendMagicLink(email: string) {
  if (!authAllowedHere()) {
    alert('Magic link is unavailable in this preview.');
    return;
  }
  return supabase!.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${location.origin}/auth/callback` },
  });
}

export async function getUser() {
  if (!hasSupabase()) return null;
  const { data } = await supabase!.auth.getUser();
  return data.user;
}

export async function signOut() {
  if (!hasSupabase()) return;
  await supabase!.auth.signOut();
}
