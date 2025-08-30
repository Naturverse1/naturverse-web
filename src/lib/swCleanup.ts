export async function swCleanupOnce() {
  try {
    if (!('serviceWorker' in navigator)) return
    const cleaned = sessionStorage.getItem('nv-sw-cleaned')
    if (cleaned) return
    const regs = await navigator.serviceWorker.getRegistrations()
    await Promise.all(regs.map(r => r.unregister().catch(() => {})))
    if ('caches' in self) {
      const keys = await caches.keys()
      await Promise.all(keys.map(k => caches.delete(k).catch(() => {})))
    }
    sessionStorage.setItem('nv-sw-cleaned','1')
  } catch {}
}
