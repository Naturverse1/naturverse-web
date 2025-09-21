// Only register the PWA service worker on the main production domain.
// Netlify deploy previews should bypass SW to avoid cached HTML intercepting asset requests.
const isMainDomain =
  typeof window !== 'undefined' && window.location.hostname === 'thenaturverse.com';

// Only runs in production builds
if (import.meta.env.PROD && 'serviceWorker' in navigator && isMainDomain) {
  // vite-plugin-pwa injects /sw.js for us
  import('workbox-window').then(({ Workbox }) => {
    const wb = new Workbox('/sw.js');
    wb.addEventListener('waiting', () => wb.messageSW({ type: 'SKIP_WAITING' }));
    wb.addEventListener('controlling', () => window.location.reload());
    wb.register();
  });
}
