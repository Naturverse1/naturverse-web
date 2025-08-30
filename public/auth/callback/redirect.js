// Forward Supabase's hash tokens from /auth/callback → / (SPA shell).
// Example: /auth/callback#access_token=...  ->  /#access_token=...
(function () {
  try {
    var hash = window.location.hash || '';
    window.location.replace('/' + (hash || ''));
  } catch (_) {
    window.location.replace('/');
  }
})();
