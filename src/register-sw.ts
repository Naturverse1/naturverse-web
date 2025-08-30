export function registerPWA() {
  // Avoid PWA registration on auth callback routes to prevent install prompt / SW shell
  if (location.pathname.startsWith('/auth/')) return;

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  }
}
