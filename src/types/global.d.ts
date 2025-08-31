export {};

declare global {
  interface Window {
    dataLayer?: unknown[];
    Naturverse?: Record<string, unknown>;
  }
}
