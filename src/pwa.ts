// Only runs when service workers are enabled
import { registerSW } from 'virtual:pwa-register';

export const initPWA = () => {
  if (import.meta.env.VITE_ENABLE_SW === 'true') {
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
  }
};
