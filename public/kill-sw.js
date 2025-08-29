// Kill any registered service workers ASAP (prevents "You're offline" trap)
(async () => {
  try {
    if ('serviceWorker' in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map(r => r.unregister().catch(() => {})));
      // Remove caches created by older builds
      if (self.caches) {
        const keys = await caches.keys();
        await Promise.all(keys.map(k => caches.delete(k).catch(() => {})));
      }
      // Hard-reload once if a SW was removed (skip reload loops)
      const flag = 'nv-sw-killed';
      if (!sessionStorage.getItem(flag)) {
        sessionStorage.setItem(flag, '1');
        location.reload();
      }
    }
  } catch (_) { /* no-op */ }
})();

const showInstall = () => {
  if (location.pathname.startsWith('/auth/')) return; // don't show on OAuth callback
  // Install prompt UI handled elsewhere
};

showInstall();
