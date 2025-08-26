// Only runs in production builds
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  // vite-plugin-pwa injects /sw.js for us
  import('workbox-window').then(({ Workbox }) => {
    const wb = new Workbox('/sw.js');
    wb.addEventListener('waiting', () => wb.messageSW({ type: 'SKIP_WAITING' }));
    wb.addEventListener('controlling', () => window.location.reload());
    wb.register();
  });
}
