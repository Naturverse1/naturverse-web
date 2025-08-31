(() => {
  try {
    // Persist the Supabase OAuth fragment so your app can pick it up
    if (location.hash && location.hash.includes('access_token')) {
      sessionStorage.setItem('nv:supabase:oauth', location.hash);
    }
  } catch {}
  // Go back to the SPA root
  location.replace('/');
})();
