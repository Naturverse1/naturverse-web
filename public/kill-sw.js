(async () => {
  try {
    if ('serviceWorker' in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map(r => r.unregister().catch(() => {})));
      if (self.caches) {
        const keys = await caches.keys();
        await Promise.all(keys.map(k => caches.delete(k).catch(() => {})));
      }
    }
    sessionStorage.setItem('nv-sw-killed', '1');
    location.replace('/');
  } catch (e) {
    location.replace('/');
  }
})();
