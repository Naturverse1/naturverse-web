import { isPreviewHost } from '@/lib/hosts';
import { VITE_ENABLE_PWA } from '@/lib/env';

export async function registerPWA() {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;
  if (!VITE_ENABLE_PWA) return;

  if (isPreviewHost()) {
    // Unregister any stray SW from a prior visit
    const regs = await navigator.serviceWorker.getRegistrations();
    await Promise.all(regs.map(r => r.unregister()));
    return;
  }

  try {
    await navigator.serviceWorker.register('/sw.js');
  } catch {
    // ignore
  }
}
