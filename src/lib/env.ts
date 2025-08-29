export const VITE_SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
export const VITE_SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// Allow previews to sign in (default true)
export const VITE_ALLOW_PREVIEW_SIGNIN =
  (import.meta.env.VITE_ALLOW_PREVIEW_SIGNIN ?? 'true').toString().toLowerCase() !== 'false';

// tiny host helpers
export const isPreviewHost = () => typeof location !== 'undefined' && /\.netlify\.app$/i.test(location.hostname);
export const currentOrigin = () =>
  typeof location !== 'undefined' ? location.origin : (globalThis as any)?.ORIGIN ?? '';
