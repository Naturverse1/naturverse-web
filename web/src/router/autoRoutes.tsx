import React from "react";
import { RouteObject } from "react-router-dom";

/**
 * Eagerly import every page component under src/pages/**.tsx
 * A page must have a default export React component.
 */
const modules = import.meta.glob("../pages/**/*.tsx", { eager: true });

function toPath(file: string) {
  // ../pages/Arcade/index.tsx -> /arcade
  // ../pages/content/Stories.tsx -> /content/stories
  let p = file.replace("../pages", "").replace(/\.tsx$/i, "");
  p = p.replace(/\/index$/i, "/");              // index routes
  p = p.replace(/\\/g, "/");
  // lower-case segments, keep dashes in filenames
  p = p.split("/").map((seg) => seg ? seg.toLowerCase() : seg).join("/");
  if (!p.startsWith("/")) p = "/" + p;
  if (p !== "/" && p.endsWith("/")) p = p.slice(0, -1);
  return p || "/";
}

export function getAutoRoutes(): RouteObject[] {
  const routes: RouteObject[] = [];

  Object.entries(modules).forEach(([file, mod]) => {
    // Skip non-components or utility files if any
    const m = mod as any;
    const Component = m?.default;
    if (!Component || typeof Component !== "function") return;

    const path = toPath(file);
    // We'll mount Home ("/") explicitly in App; skip here to avoid duplicates
    if (path === "/") return;

    routes.push({
      path,
      element: React.createElement(Component)
    });
  });

  // Sort deeper paths after shallow ones to avoid conflicts
  routes.sort((a, b) => (a.path!.split("/").length - b.path!.split("/").length));
  return routes;
}
