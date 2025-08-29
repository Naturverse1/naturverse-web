import { supabase } from './supabase-client';

export const PROD_ORIGIN =
  import.meta.env.VITE_PROD_ORIGIN ?? 'https://thenaturverse.com';

export function currentUrl(): string {
  if (typeof window === 'undefined') return PROD_ORIGIN + '/';
  return window.location.href;
}

export function isNetlifyPreviewHost(hostname?: string) {
  const h = hostname ?? (typeof window !== 'undefined' ? window.location.hostname : '');
  return /\.netlify\.app$/.test(h);
}

// Build the OAuth finish URL on prod, including a return param back to where we started.
export function buildProdFinishUrl(returnTo?: string) {
  const url = new URL('/auth/complete', PROD_ORIGIN);
  if (returnTo) url.searchParams.set('return', returnTo);
  return url.toString();
}

export async function sendMagicLink(email: string) {
  return supabase!.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: buildProdFinishUrl(currentUrl()) },
  });
}

export async function getUser() {
  const { data } = await supabase!.auth.getUser();
  return data.user;
}

export async function signOut() {
  await supabase!.auth.signOut();
}
