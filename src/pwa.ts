// Only runs in production builds by default
import { registerSW } from 'virtual:pwa-register';

export const initPWA = () => {
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
