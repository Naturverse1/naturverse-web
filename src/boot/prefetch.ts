// Dev helper for route prefetching. In production we no-op to avoid bad modulepreload paths.
export function prefetchRoutes() {
  if (import.meta.env.DEV) {
    // (Optional) keep your dev prefetch here, or leave empty.
    // Example:
    // const routes = import.meta.glob('../routes/**/*.tsx');
    // Object.keys(routes); // touching globs in dev is fine
  }
}
