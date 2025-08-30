// Kill any registered service workers and hard-reload once
(async () => {
  try {
    if ('serviceWorker' in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map(r => r.unregister().catch(() => {})));
    }
    if (self.caches) {
      const keys = await caches.keys();
      await Promise.all(keys.map(k => caches.delete(k).catch(() => {})));
    }
    const flag = 'nv-sw-killed';
    if (!sessionStorage.getItem(flag)) {
      sessionStorage.setItem(flag, '1');
      location.reload();
    }
  } catch (_) {}
})();
