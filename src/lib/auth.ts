import { hasSupabase, supabase } from './supabase-client';

export { supabase };

// Centralized auth helpers for safe OAuth from previews/permalinks

// Optionally override via env; defaults to your live domain.
export const PROD_ORIGIN =
  import.meta.env.VITE_PROD_ORIGIN ?? 'https://thenaturverse.com';

export const OAUTH_REDIRECT = `${PROD_ORIGIN}/auth/callback`;

// Helper for any host-specific logic (kept here for reuse if needed)
export const isPreviewHost = () =>
  typeof window !== 'undefined' &&
  /\.netlify\.app$/.test(window.location.hostname);

export async function sendMagicLink(email: string) {
  if (!hasSupabase()) return { data: null, error: new Error('Auth unavailable') };
  return supabase!.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: OAUTH_REDIRECT },
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
