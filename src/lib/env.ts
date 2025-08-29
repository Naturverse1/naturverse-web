export const HOST = typeof window !== 'undefined' ? window.location.host : '';
export const IS_NETLIFY_PREVIEW = HOST.includes('--') && HOST.endsWith('.netlify.app');

export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || import.meta.env.SUPABASE_URL;
export const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.SUPABASE_ANON_KEY;

export const STRIPE_PK = import.meta.env.VITE_STRIPE_PK || '';
