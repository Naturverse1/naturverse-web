(async () => {
  try {
    // 1) Unregister all SWs
    if ('serviceWorker' in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map(r => r.unregister().catch(() => {})));
    }
    // 2) Clear all caches
    if (self.caches && caches.keys) {
      const keys = await caches.keys();
      await Promise.all(keys.map(k => caches.delete(k).catch(() => {})));
    }
  } catch {}

  // 3) Small delay to ensure SW is gone, then hard reload home
  setTimeout(() => {
    // bust any cached shell aggressively
    const bust = String(Date.now());
    location.replace('/?cleared=' + bust);
  }, 250);
})();
