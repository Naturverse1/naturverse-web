// Only runs in production builds
const DISABLE_PWA = import.meta.env.VITE_DISABLE_PWA !== '0';

if (!DISABLE_PWA && import.meta.env.PROD && 'serviceWorker' in navigator) {
  // vite-plugin-pwa injects /sw.js for us
  import('workbox-window').then(({ Workbox }) => {
    const wb = new Workbox('/sw.js');
    wb.addEventListener('waiting', () => wb.messageSW({ type: 'SKIP_WAITING' }));
    wb.addEventListener('controlling', () => window.location.reload());
    wb.register();
  });
}
