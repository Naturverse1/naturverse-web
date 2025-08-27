export async function ensureNoServiceWorker() {
  if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;

  // If SW is disabled (default), unregister anything lingering from old builds.
  const swEnabled = import.meta.env.VITE_ENABLE_SW === "true";
  try {
    const regs = await navigator.serviceWorker.getRegistrations();
    if (!swEnabled) {
      await Promise.all(regs.map(r => r.unregister()));
      // After unregister, trigger a hard reload so we’re off the old SW.
      // Only do this once per session to avoid loops.
      const k = "__nv_sw_unreg";
      if (!sessionStorage.getItem(k)) {
        sessionStorage.setItem(k, "1");
        location.reload();
      }
    }
  } catch {}
}
