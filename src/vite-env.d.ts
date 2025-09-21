/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_SITE_URL?: string;
  readonly VITE_ENABLE_AI?: string;
  readonly VITE_ENABLE_AUTO_STAMPS?: string;
  readonly HUGGINGFACE_API_KEY: string;
  readonly NAVATAR_BRAND_STYLE?: string;
  readonly NAVATAR_NEGATIVE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
