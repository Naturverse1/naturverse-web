// Only runs when service workers are enabled in production
if (import.meta.env.VITE_ENABLE_SW === 'true' && import.meta.env.PROD && 'serviceWorker' in navigator) {
  // vite-plugin-pwa injects /sw.js for us
  import('workbox-window').then(({ Workbox }) => {
    const wb = new Workbox('/sw.js');
    wb.addEventListener('waiting', () => wb.messageSW({ type: 'SKIP_WAITING' }));
    wb.addEventListener('controlling', () => window.location.reload());
    wb.register();
  });
}
