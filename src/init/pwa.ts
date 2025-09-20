export function initPWA() {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

  const host = window.location.host;
  const isPreview = host.includes('--') || host.endsWith('netlify.app');

  if (isPreview) {
    navigator.serviceWorker
      .getRegistrations()
      .then((registrations) => registrations.forEach((registration) => registration.unregister()))
      .catch(() => {});
    return;
  }

  if (import.meta.env.PROD) {
    window.addEventListener('load', () => {
      import('../register-sw').catch(() => {});
    });
  }
}
