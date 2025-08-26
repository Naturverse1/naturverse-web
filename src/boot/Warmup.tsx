import { useEffect } from "react";

function onIdle(cb: () => void) {
  if (typeof window !== "undefined" && "requestIdleCallback" in window) {
    // @ts-ignore
    return window.requestIdleCallback(cb);
  }
  return setTimeout(cb, 120);
}

export default function Warmup() {
  useEffect(() => {
    const loaders: Array<() => Promise<unknown>> = [
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
      // zones subroutes
      () => import("../routes/zones/arcade/index").catch(() => {}),
      () => import("../routes/zones/music/index").catch(() => {}),
    ];

    loaders.forEach((load, i) => {
      onIdle(() => setTimeout(() => load(), i * 150));
    });
  }, []);

  return null;
}
