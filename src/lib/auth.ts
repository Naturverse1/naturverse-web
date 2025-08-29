import { createClient } from '@supabase/supabase-js';
import { VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, VITE_ALLOW_PREVIEW_AUTH } from './env';
import { getHost, isPreviewHost, isProdHost } from './hosts';

let _client: ReturnType<typeof createClient> | null = null;

export function getSupabase() {
  // In previews, allow auth only if explicitly enabled
  if (isPreviewHost() && !VITE_ALLOW_PREVIEW_AUTH) return null;

  if (!_client) {
    if (!VITE_SUPABASE_URL || !VITE_SUPABASE_ANON_KEY) return null;
    _client = createClient(VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, {
      auth: {
        // Build redirect URL dynamically; prod domain only
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    });
  }
  return _client;
}

export function getOAuthRedirect(): string | undefined {
  const host = getHost();
  if (isProdHost(host)) return `https://${host}/auth/callback`;
  if (isPreviewHost(host) && VITE_ALLOW_PREVIEW_AUTH) return `https://${host}/auth/callback`;
  return undefined; // previews disabled
}

export async function signInWithGoogle() {
  const supabase = getSupabase();
  const redirectTo = getOAuthRedirect();
  if (!supabase || !redirectTo) {
    throw new Error('Sign-in is disabled on previews. Please open the production site.');
  }
  await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo },
  });
}

export async function sendMagicLink(email: string) {
  const supabase = getSupabase();
  const redirectTo = getOAuthRedirect();
  if (!supabase || !redirectTo) {
    throw new Error('Sign-in is disabled on previews. Please open the production site.');
  }
  return supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: redirectTo },
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
