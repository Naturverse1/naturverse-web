import supabase from '@/lib/supabaseClient';
export { supabase };

export async function signInWithGoogle() {
  const redirectTo = `${window.location.origin}/auth/callback`;
  await supabase().auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo,
      queryParams: { prompt: 'select_account' },
    },
  });
}

export async function sendMagicLink(email: string) {
  const emailRedirectTo = `${window.location.origin}/auth/callback`;
  await supabase().auth.signInWithOtp({
    email,
    options: { emailRedirectTo },
  });
}

export async function signInWithMagic(email: string) {
  return sendMagicLink(email);
}

export async function getUser() {
  const { data, error } = await supabase().auth.getUser();
  if (error) throw error;
  return data.user;
}

export async function signOut() {
  const { error } = await supabase().auth.signOut();
  if (error) throw error;
}
