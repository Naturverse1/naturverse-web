// Safe route warmup: never fail the build if a route doesn't exist.
// In dev this preloads typical pages for a snappier first navigation.
// In prod it quietly no-ops if anything is missing.

async function warmupRoutes() {
  // List the pages you *expect* to exist. Missing ones will be skipped safely.
  // Adjust this list anytime you add/remove pages—no risk to the build.
  const routes = [
    "../pages/Home",
    "../pages/Worlds",
    "../pages/Zones",
    "../pages/Marketplace",
    "../pages/Wishlist",
    "../pages/Naturversity",
    "../pages/NaturBank",
    "../pages/Navatar",
    "../pages/Passport",
    "../pages/Turian",
    // Add any nested routes you actually have, e.g.:
    // "../routes/zones/arcade/index",
    // "../routes/worlds/thailandia/index",
  ];

  // Only try to warm during client runtime; SSR/build stays safe regardless.
  // Still fine to run in prod—errors are caught and ignored.
  for (const route of routes) {
    try {
      // Dynamic + vite-ignore prevents Rollup from resolving at build time.
      await import(/* @vite-ignore */ route);
      if (import.meta?.env?.DEV) {
        // eslint-disable-next-line no-console
        console.log(`[warmup] preloaded: ${route}`);
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn(`[warmup] skipped missing route: ${route}`);
    }
  }
}

// Kick off; do not await so it never blocks app startup.
try {
  warmupRoutes();
} catch {
  /* swallow */
}
