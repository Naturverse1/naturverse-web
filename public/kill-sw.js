/**
 * Runs early to clear any stale service worker the moment the HTML loads.
 * Safe to keep in production while SW is disabled.
 */
(function killSW(){
  try {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistrations()
        .then(rs => rs.forEach(r => r.unregister()))
        .catch(()=>{});
    }
  } catch {}
})();
