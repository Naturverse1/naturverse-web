// Don’t register a SW on auth routes; it interferes with the callback boot
export async function registerSW() {
  if (location.pathname.startsWith('/auth/')) return
  if (!('serviceWorker' in navigator)) return
  try {
    await navigator.serviceWorker.register('/sw.js')
  } catch {}
}
