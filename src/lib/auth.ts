import { getSupabase, supabase } from '@/lib/supabaseClient';

const DEFAULT_REDIRECT_PATH = '/profile';

function getBrowserCurrentPath() {
  if (typeof window === 'undefined') return DEFAULT_REDIRECT_PATH;
  const path = window.location.pathname + window.location.search;
  return path || DEFAULT_REDIRECT_PATH;
}

export function resolveRedirectPath(next?: string | null, fallback = DEFAULT_REDIRECT_PATH) {
  if (!next) return fallback;
  if (next.startsWith('/')) return next;

  try {
    const base = typeof window !== 'undefined' ? window.location.origin : 'http://localhost';
    const isAbsolute = /^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(next);
    if (isAbsolute && typeof window === 'undefined') {
      return fallback;
    }

    const url = new URL(next, base);
    if (typeof window !== 'undefined' && url.origin !== window.location.origin) {
      return fallback;
    }
    if (!url.pathname.startsWith('/')) {
      return fallback;
    }
    return (url.pathname + url.search + url.hash) || fallback;
  } catch {
    return fallback;
  }
}

export function buildAuthRedirect(next?: string | null, fallback?: string) {
  if (typeof window === 'undefined') {
    throw new Error('Auth redirects require a browser environment.');
  }
  const target = resolveRedirectPath(next, fallback ?? getBrowserCurrentPath());
  const url = new URL('/auth/callback', window.location.origin);
  if (target) {
    url.searchParams.set('next', target);
  }
  return url.toString();
}

export { supabase, DEFAULT_REDIRECT_PATH };

export async function signInWithGoogle(next?: string | null) {
  const redirectTo = buildAuthRedirect(next);
  await getSupabase().auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo,
      queryParams: { prompt: 'select_account' },
    },
  });
}

export async function sendMagicLink(email: string, next?: string | null) {
  const emailRedirectTo = buildAuthRedirect(next);
  await getSupabase().auth.signInWithOtp({
    email,
    options: { emailRedirectTo },
  });
}

export async function signInWithMagic(email: string, next?: string | null) {
  return sendMagicLink(email, next);
}

export async function getUser() {
  const { data, error } = await getSupabase().auth.getUser();
  if (error) throw error;
  return data.user;
}

export async function signOut() {
  const { error } = await getSupabase().auth.signOut();
  if (error) throw error;
}
