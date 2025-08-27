// Kill any service workers + caches so old PWA shells can't hijack prod.
(async () => {
  try {
    if ('serviceWorker' in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.allSettled(regs.map(r => r.unregister()));
    }
    if (self.caches?.keys) {
      const keys = await caches.keys();
      await Promise.allSettled(keys.map(k => caches.delete(k)));
    }
    const url = new URL(location.href);
    if (url.searchParams.has('kill-sw')) {
      url.searchParams.delete('kill-sw');
      location.replace(url.toString());
    }
  } catch (e) {
    console.warn('[kill-sw] failed:', e);
  }
})();
