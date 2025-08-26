(function(){
  if ((window as any).__naturverse_logger__) return;
  (window as any).__naturverse_logger__ = true;
  const tag = (label: string, payload: any) => {
    // eslint-disable-next-line no-console
    console.error(`[naturverse] ${label}`, payload?.message ?? payload, payload?.stack ?? payload);
  };
  window.addEventListener('error', (ev) => tag('window.onerror', ev.error ?? ev.message));
  window.addEventListener('unhandledrejection', (ev: any) => tag('unhandledrejection', ev.reason ?? ev));
  // mark active
  // eslint-disable-next-line no-console
  console.log('[naturverse] runtime logger active');
})();
