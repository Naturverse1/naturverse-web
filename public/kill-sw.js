// Kill any active/installed service workers and clear their caches.
// Runs once per browser and then removes its own query flag.
(async () => {
  try {
    if ('serviceWorker' in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.allSettled(regs.map((r) => r.unregister()));
    }
    if (window.caches?.keys) {
      const keys = await caches.keys();
      await Promise.allSettled(keys.map((k) => caches.delete(k)));
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
