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
    // Avoid reload loops
    const FLAG = 'nv-sw-killed';
    if (!sessionStorage.getItem(FLAG)) {
      sessionStorage.setItem(FLAG, '1');
      location.replace('/'); // go home after wipe
    }
  } catch {}
})();
