// Parse the Supabase hash and land on / while keeping the fragment for the app
(function () {
  try {
    // example: /auth/callback#access_token=...&expires_in=...&token_type=bearer
    var hash = location.hash ? location.hash.slice(1) : '';
    var qs = hash ? '#' + hash : '';
    // land on / and keep the fragment for the app boot
    location.replace('/' + qs);
  } catch (e) {
    // worst-case, just go home
    location.replace('/');
  }
})();
