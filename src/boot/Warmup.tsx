import { useEffect } from "react";

/** requestIdleCallback polyfill */
function onIdle(cb: () => void) {
  // @ts-ignore
  if (typeof window !== "undefined" && window.requestIdleCallback) {
    // @ts-ignore
    return window.requestIdleCallback(cb);
  }
  return setTimeout(cb, 150);
}

/**
 * Warm-up route chunks & heavy components when the browser is idle.
 * Each import is guarded; missing files are ignored safely.
 */
export default function Warmup() {
  useEffect(() => {
    const loaders: Array<() => Promise<unknown>> = [
      // Top-level pages (two likely paths each, guarded)
      () => import("../pages/Worlds").catch(() => {}),
      () => import("../routes/worlds/index").catch(() => {}),
      () => import("../pages/Zones").catch(() => {}),
      () => import("../routes/zones/index").catch(() => {}),
      () => import("../pages/Marketplace").catch(() => {}),
      () => import("../routes/marketplace/index").catch(() => {}),
      () => import("../pages/Naturversity").catch(() => {}),
      () => import("../routes/naturversity/index").catch(() => {}),
      () => import("../pages/NaturBank").catch(() => {}),
      () => import("../routes/NaturBank").catch(() => {}),
      () => import("../pages/Navatar").catch(() => {}),
      () => import("../routes/Navatar").catch(() => {}),
      () => import("../pages/Passport").catch(() => {}),
      () => import("../routes/Passport").catch(() => {}),
      () => import("../pages/Turian").catch(() => {}),
      () => import("../routes/Turian").catch(() => {}),
      // Popular zone subroutes
      () => import("../routes/zones/arcade/index").catch(() => {}),
      () => import("../routes/zones/music/index").catch(() => {}),
    ];

    // Stagger the warmup slightly so we don't spike bandwidth
    loaders.forEach((load, i) => {
      onIdle(() => setTimeout(() => load(), i * 120));
    });
  }, []);

  return null;
}
