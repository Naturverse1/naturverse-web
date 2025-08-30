// Never register a SW on auth handoff routes
if (location.pathname.startsWith('/auth/')) {
  // make sure we don't leave a stale SW around
  try {
    if ('serviceWorker' in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map((r) => r.unregister().catch(() => {})));
    }
  } catch {}
  // Skip registering
} else {
  // Only runs in production builds
  if (import.meta.env.PROD && 'serviceWorker' in navigator) {
    const host = location.hostname;
    const onNetlify = host.endsWith('.netlify.app');
    if (!onNetlify) {
      // vite-plugin-pwa injects /sw.js for us
      import('workbox-window').then(({ Workbox }) => {
        const wb = new Workbox('/sw.js');
        wb.addEventListener('waiting', () => wb.messageSW({ type: 'SKIP_WAITING' }));
        wb.addEventListener('controlling', () => window.location.reload());
        wb.register();
      });
    }
  }
}
