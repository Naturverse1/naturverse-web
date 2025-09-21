/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_SITE_URL?: string;
  readonly VITE_ENABLE_AI?: string;
  readonly VITE_ENABLE_AUTO_STAMPS?: string;
  readonly HUGGINGFACE_API_KEY?: string; // fine-grained preferred
  readonly HF_API_TOKEN?: string; // classic fallback
  readonly HF_MODEL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
