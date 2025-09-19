/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_SITE_URL?: string;
  readonly VITE_ENABLE_AI?: string;
  readonly VITE_ENABLE_AUTO_STAMPS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
