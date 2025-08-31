(() => {
  try {
    if (location.hash && location.hash.startsWith("#")) {
      sessionStorage.setItem("nv_oauth_hash", location.hash);
    }
    if (location.search && location.search.startsWith("?")) {
      sessionStorage.setItem("nv_oauth_search", location.search);
    }
  } finally {
    location.replace("/");
  }
})();
