export const VITE_SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
export const VITE_SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const STRIPE_PK = import.meta.env.VITE_STRIPE_PK as string | undefined;

// Optional flags you already set; safe defaults if absent
export const VITE_ENABLE_PWA = (import.meta.env.VITE_ENABLE_PWA ?? 'true') === 'true';
export const VITE_ALLOW_PREVIEW_AUTH = (import.meta.env.VITE_ALLOW_PREVIEW_AUTH ?? 'false') === 'true';
