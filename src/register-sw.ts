// Only runs in production builds
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  // Avoid caching deploy-preview assets so users always get fresh bundles.
  const hostname = window.location.hostname;
  if (hostname.endsWith('netlify.app')) {
    return;
  }

  // vite-plugin-pwa injects /sw.js for us
  import('workbox-window').then(({ Workbox }) => {
    const wb = new Workbox('/sw.js');
    wb.addEventListener('waiting', () => wb.messageSW({ type: 'SKIP_WAITING' }));
    wb.addEventListener('controlling', () => window.location.reload());
    wb.register().then(reg => reg.update());
  });
}
