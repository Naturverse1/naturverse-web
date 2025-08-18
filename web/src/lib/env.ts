type Env = {
  SUPABASE_URL?: string;
  SUPABASE_ANON_KEY?: string;
  CHAIN_ID?: string;
  RPC_URL?: string;
  NATUR_TOKEN?: string;
  MERCHANT_ADDRESS?: string;
};

export function getEnv(): Env {
  const e = import.meta.env;
  const env: Env = {
    SUPABASE_URL: e.VITE_SUPABASE_URL,
    SUPABASE_ANON_KEY: e.VITE_SUPABASE_ANON_KEY,
    CHAIN_ID: e.VITE_CHAIN_ID,
    RPC_URL: e.VITE_RPC_URL,
    NATUR_TOKEN: e.VITE_NATUR_TOKEN,
    MERCHANT_ADDRESS: e.VITE_MERCHANT_ADDRESS,
  };
  // eslint-disable-next-line no-console
  if (!env.SUPABASE_URL || !env.SUPABASE_ANON_KEY) {
    console.warn('[Naturverse] Supabase env missing');
  }
  return env;
}
