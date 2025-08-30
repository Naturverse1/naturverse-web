// run as early as possible; just normalize the URL and let the app boot
(function () {
  try {
    if (location.pathname === '/auth/callback' && location.hash.includes('access_token')) {
      const url = new URL(location.href);
      const params = new URLSearchParams(url.hash.slice(1)); // remove leading '#'
      // Keep tokens in the hash so Supabase can pick them up post-boot,
      // but swap path to '/' so assets resolve correctly.
      history.replaceState(null, '', '/' + (params.size ? '#' + params.toString() : ''));
    }
  } catch {
    /* no-op */
  }
})();
