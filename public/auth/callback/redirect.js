// Bounce to site root while preserving the Supabase OAuth fragment
(function () {
  try {
    var hash = window.location.hash || '';
    // strip any stray query; Supabase uses the fragment (#)
    window.location.replace('/' + (hash.startsWith('#') ? hash : ('#' + hash)));
  } catch (_) {
    // last resort: go home
    window.location.replace('/');
  }
})();
