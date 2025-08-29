import { IS_NETLIFY_PREVIEW } from '@/lib/env';

export function registerPWA() {
  if ('serviceWorker' in navigator && location.pathname !== '/auth/callback') {
    // Don’t register on Netlify previews; do unregister if one exists.
    if (IS_NETLIFY_PREVIEW) {
      navigator.serviceWorker.getRegistrations?.().then((regs) =>
        regs.forEach((r) => r.unregister())
      );
      return;
    }

    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').catch((e) =>
        console.warn('[naturverse] SW register failed', e)
      );
    });
  }
}
