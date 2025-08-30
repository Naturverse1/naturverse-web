import { supabase } from './supabase-client';

/** Always return to the current host (preview or prod) */
export async function signInWithGoogle() {
  return supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/`,
      queryParams: { prompt: 'select_account' },
    },
  });
}

export async function sendMagicLink(email: string) {
  const redirectTo = `${window.location.origin}/`;
  return supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: redirectTo },
  });
}

export async function getUser() {
  const { data } = await supabase.auth.getUser();
  return data.user;
}

export async function signOut() {
  await supabase.auth.signOut();
}
