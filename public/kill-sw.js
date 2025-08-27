// Kill any active/installed service workers and clear their caches.
// Runs once per browser and then removes its own query flag.
(async () => {
  try {
    if ('serviceWorker' in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.allSettled(regs.map(r => r.unregister()));
    }
    if (window.caches && caches.keys) {
      const keys = await caches.keys();
      await Promise.allSettled(keys.map(k => caches.delete(k)));
    }
    // If this page request has ?kill-sw=1, drop it and reload cleanly
    const url = new URL(location.href);
    if (url.searchParams.has('kill-sw')) {
      url.searchParams.delete('kill-sw');
      location.replace(url.toString());
    }
  } catch (e) {
    // Don't block render on errors
    console.warn('[kill-sw] failed:', e);
  }
})();
