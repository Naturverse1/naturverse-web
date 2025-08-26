/**
 * Tiny runtime logger so we can see the real error before the error boundary.
 * Safe in prod; prints to console only (no UI).
 */
if (typeof window !== 'undefined') {
  // Avoid double-registering in fast refresh
  // @ts-ignore
  if (!window.__nvLoggerInstalled) {
    // @ts-ignore
    window.__nvLoggerInstalled = true;
    window.addEventListener('error', (ev) => {
      // eslint-disable-next-line no-console
      console.error(
        '[naturverse] window.onerror',
        ev.message,
        ev.error || '(no error object)',
        ev.filename,
        ev.lineno,
        ev.colno,
      );
    });
    window.addEventListener('unhandledrejection', (ev) => {
      // eslint-disable-next-line no-console
      console.error(
        '[naturverse] unhandledrejection',
        ev.reason || '(no reason)',
      );
    });
    // eslint-disable-next-line no-console
    console.log('[naturverse] runtime logger active');
  }
}

