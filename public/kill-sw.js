// Kill any registered service workers (useful after policy/route changes)
(async () => {
  try {
    if ('serviceWorker' in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map((r) => r.unregister().catch(() => {})));
    }
    if (self.caches) {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k).catch(() => {})));
    }
    // Hard reload once to avoid reload loops
    const flag = 'nv-sw-killed';
    if (!sessionStorage.getItem(flag)) {
      sessionStorage.setItem(flag, '1');
      location.reload();
    }
  } catch {}
})();
