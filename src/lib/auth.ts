import { supabase } from './supabaseClient';

const callbackUrl = `${window.location.origin}/auth/callback`;

export async function signInWithGoogle() {
  return supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: callbackUrl },
  });
}

export async function sendMagicLink(email: string) {
  return supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: callbackUrl },
  });
}

export async function getUser() {
  const { data } = await supabase.auth.getUser();
  return data.user;
}

export async function signOut() {
  await supabase.auth.signOut();
}
