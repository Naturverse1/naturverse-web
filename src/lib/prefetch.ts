// Tiny chunk prefetcher for Vite dynamic imports
export function prefetch(url: string, as: "script" | "style" | "font" = "script") {
  if (typeof document === "undefined") return;
  const link = document.createElement("link");
  link.rel = as === "script" ? "modulepreload" : "prefetch";
  link.as = as as any;
  link.href = url;
  link.crossOrigin = "";
  document.head.appendChild(link);
}

type GlobRecord = Record<string, () => Promise<unknown>>;

/**
 * Given a Vite import.meta.glob map, prefetch all the chunks.
 * (It triggers the HTTP fetch without executing modules.)
 */
export function prefetchGlob(glob: GlobRecord) {
  for (const loader of Object.values(glob)) {
    // @ts-expect-error Vite exposes .toString() -> chunk URL in modern builds
    const hinted = loader.__vitePreload || loader.toString?.();
    if (typeof hinted === "string") {
      prefetch(hinted, "script");
    } else {
      // fallback: actually request but don't execute
      loader();
    }
  }
}

/** Prefetch when a user hovers/focuses a link to a route */
export function prefetchOnHover(selector = 'a[href^="/"]') {
  if (typeof document === "undefined") return;
  const seen = new Set<string>();
  const handler = (e: Event) => {
    const a = e.target as HTMLAnchorElement;
    if (!a || !a.href) return;
    if (seen.has(a.pathname)) return;
    seen.add(a.pathname);
    // you can map path -> import() here if you have per-route code splitting
  };
  document.addEventListener("mouseover", handler, { passive: true, capture: true });
  document.addEventListener("focusin", handler, { passive: true, capture: true });
}
