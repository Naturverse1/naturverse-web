import { useEffect } from "react";

function onIdle(cb: () => void) {
  // Polyfill requestIdleCallback
  // @ts-ignore
  if (typeof window !== "undefined" && window.requestIdleCallback) {
    // @ts-ignore
    return window.requestIdleCallback(cb);
  }
  return setTimeout(cb, 150);
}

/**
 * Preload popular routes + chunks during idle time.
 * All imports are wrapped in catch() to avoid breaking if missing.
 */
export default function Warmup() {
  useEffect(() => {
    const loaders: Array<() => Promise<unknown>> = [
      () => import("../routes/worlds/index").catch(() => {}),
      () => import("../routes/zones/index").catch(() => {}),
      () => import("../routes/marketplace/index").catch(() => {}),
      () => import("../routes/naturbank/index").catch(() => {}),
      () => import("../routes/navatar/index").catch(() => {}),
      () => import("../routes/turian/index").catch(() => {}),
      // Zone subroutes
      () => import("../routes/zones/arcade/index").catch(() => {}),
      () => import("../routes/zones/music/index").catch(() => {}),
    ];

    loaders.forEach((load, i) => {
      onIdle(() => setTimeout(() => load(), i * 120));
    });
  }, []);

  return null;
}
