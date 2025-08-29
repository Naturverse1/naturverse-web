import { hasSupabase, supabase } from './supabaseClient';

const PROD_ORIGIN = 'https://thenaturverse.com';
const callbackUrl = `${PROD_ORIGIN}/auth/callback`;

export async function signInWithGoogle() {
  if (!hasSupabase()) {
    alert('Sign-in is unavailable in this preview. Please use the production site.');
    return;
  }
  return supabase!.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: callbackUrl },
  });
}

export async function sendMagicLink(email: string) {
  if (!hasSupabase()) {
    alert('Magic link is unavailable in this preview. Please use the production site.');
    return;
  }
  return supabase!.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: callbackUrl },
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
