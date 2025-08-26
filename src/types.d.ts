export {}
declare global {
  interface ImportMetaEnv {
    readonly VITE_FLAGS?: string
    readonly VITE_ANALYTICS_PROVIDER?: 'plausible'|'umami'
    readonly VITE_ANALYTICS_DOMAIN?: string
    readonly VITE_UMAMI_WEBSITE_ID?: string
    readonly VITE_UMAMI_SRC?: string
  }
}
