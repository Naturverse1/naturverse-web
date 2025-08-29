export const HOST = typeof window !== 'undefined' ? window.location.host : '';
export const IS_NETLIFY_PREVIEW = HOST.includes('--') && HOST.endsWith('.netlify.app');

export const ALLOW_PREVIEW_SIGNIN =
  (import.meta.env.VITE_ALLOW_PREVIEW_SIGNIN ?? '').toString() === 'true' ||
  (import.meta.env.VITE_ALLOW_PREVIEW_AUTH ?? '').toString() === 'true';

export const CAN_SIGN_IN = !IS_NETLIFY_PREVIEW || ALLOW_PREVIEW_SIGNIN;

export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || import.meta.env.SUPABASE_URL;
export const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.SUPABASE_ANON_KEY;

export const STRIPE_PK = import.meta.env.VITE_STRIPE_PK || '';
