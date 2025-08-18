export function bootDiagnostics() {
  // Show minimal, non-sensitive boot info
  // NOTE: You can remove this after we confirm stability.
  // @ts-expect-error
  const sha = (window as any).__BUILD_SHA__ || import.meta.env.VITE_BUILD_SHA;
  const envKeys = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY',
    'VITE_CHAIN_ID',
    'VITE_RPC_URL',
    'VITE_NATUR_TOKEN',
    'VITE_MERCHANT_ADDRESS',
  ];
  const envReport = Object.fromEntries(
    envKeys.map((k) => [k, Boolean(import.meta.env[k as keyof ImportMetaEnv])]),
  );
  // eslint-disable-next-line no-console
  console.info('[Naturverse] boot', { sha, env: envReport, ua: navigator.userAgent });
}
