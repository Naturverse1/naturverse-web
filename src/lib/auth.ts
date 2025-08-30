import { supabase } from './supabase-client';

export async function signInWithGoogle() {
  // Ensure OAuth returns to a page that can parse the hash BEFORE any CSP/SW interfere
  const redirectTo = `${window.location.origin}/auth/callback`;
  return supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo,
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
  try {
    await supabase.auth.signOut({ scope: 'global' });
  } finally {
    Object.keys(localStorage).forEach((k) => {
      if (k.startsWith('sb-')) localStorage.removeItem(k);
    });
    window.location.assign('/');
  }
}
