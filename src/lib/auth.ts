import { supabase } from '@/lib/supabase-client';
export { supabase };

export async function signInWithGoogle() {
  const redirectTo = `${window.location.origin}/auth/callback`;
  await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo,
      queryParams: { prompt: 'select_account' },
    },
  });
}

export async function sendMagicLink(email: string) {
  const emailRedirectTo = `${window.location.origin}/auth/callback`;
  await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo },
  });
}
