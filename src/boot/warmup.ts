/**
 * Safe warmup: defer-heavy imports until after first paint,
 * avoid importing non-existent pages at build time.
 */
export function warmup() {
  if (typeof window === 'undefined') return;

  // Preload a few real route bundles *lazily* and ignore failures.
  const ok = (p: Promise<unknown>) => p.catch(() => {});
  queueMicrotask(() => {
    ok(import('../pages/Home'));
    ok(import('../pages/Passport'));
    ok(import('../pages/Marketplace'));
  });
}
