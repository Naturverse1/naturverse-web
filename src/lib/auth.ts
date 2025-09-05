import { supabase } from '@/lib/supabase-client';
import type { User } from '@supabase/supabase-js';
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

export async function getUser(): Promise<User | null> {
  const { data } = await supabase.auth.getUser();
  return data.user ?? null;
}

export async function signOut() {
  await supabase.auth.signOut();
}
