import { getSupabase } from '@/lib/supabase-client';

export async function signInWithGoogle() {
  const supabase = getSupabase();
  if (!supabase) return;
  await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/`,
      queryParams: { prompt: 'select_account' },
    },
  });
}

export async function sendMagicLink(email: string) {
  const supabase = getSupabase();
  if (!supabase) return;
  await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${window.location.origin}/` },
  });
}

export async function getUser() {
  const supabase = getSupabase();
  if (!supabase) return null;
  const { data } = await supabase.auth.getUser();
  return data.user;
}

export async function signOut() {
  const supabase = getSupabase();
  if (!supabase) return;
  await supabase.auth.signOut();
}
