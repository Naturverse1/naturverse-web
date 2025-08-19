// Safe, client-side env access (never throws at import time)
export const env = {
  supabaseUrl: (import.meta as any).env?.VITE_SUPABASE_URL as string | undefined,
  supabaseAnonKey: (import.meta as any).env?.VITE_SUPABASE_ANON_KEY as string | undefined,
};

export function warnIfMissingEnv() {
  const missing = Object.entries(env)
    .filter(([, v]) => !v)
    .map(([k]) => k);
  if (missing.length) {
    // Don't crash; show a clear console warning so we see it in production
    console.warn(`[ENV] Missing client env: ${missing.join(", ")}. Check Netlify site env.`);
  }
}
