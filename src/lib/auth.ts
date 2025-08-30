import { supabase } from './supabase-client';

/** Always return to the current host (preview or prod) */
export async function signInWithGoogle() {
  return supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      // Always land on the app shell; no more /auth/callback
      redirectTo: `${window.location.origin}/`,
      queryParams: { prompt: 'select_account' }
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
  try {
    await supabase.auth.signOut({ scope: 'global' });
  } finally {
    Object.keys(localStorage).forEach((k) => {
      if (k.startsWith('sb-')) localStorage.removeItem(k);
    });
    window.location.assign('/');
  }
}
