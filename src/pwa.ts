// Only runs in production builds by default
import { registerSW } from 'virtual:pwa-register';

const DISABLE_PWA = import.meta.env.VITE_DISABLE_PWA !== '0';

export const initPWA = () => {
  if (DISABLE_PWA) return;
  const updateSW = registerSW({
    immediate: true,
    onNeedRefresh() {
      // show toast
      const ev = new CustomEvent('pwa:need-refresh');
      window.dispatchEvent(ev);
    },
    onOfflineReady() {
      const ev = new CustomEvent('pwa:offline-ready');
      window.dispatchEvent(ev);
    },
  });
  // expose to a button if needed later
  (window as any).forcePwaUpdate = updateSW;
};
