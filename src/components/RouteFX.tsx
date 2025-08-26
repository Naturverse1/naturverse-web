import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * RouteFX
 * Runs tiny side-effects on route change, but can NEVER break render.
 * – scrolls to top
 * – moves focus to <main> (if present) for a11y
 * All ops are guarded and wrapped in try/catch.
 */
export default function RouteFX() {
  const { pathname } = useLocation();

  useEffect(() => {
    try {
      // Guard for SSR / non-browser runtimes
      if (typeof window !== "undefined") {
        // Scroll to top, but tolerate unsupported smooth behavior
        try {
          window.scrollTo({ top: 0, left: 0, behavior: "smooth" as ScrollBehavior });
        } catch {
          window.scrollTo(0, 0);
        }
      }

      // Focus main for screen readers if it exists
      const main =
        typeof document !== "undefined"
          ? (document.querySelector("main") as HTMLElement | null)
          : null;

      if (main) {
        // Ensure focusable
        if (!main.hasAttribute("tabindex")) main.setAttribute("tabindex", "-1");
        try {
          main.focus({ preventScroll: true });
        } catch {
          // Older browsers
          main.focus();
        }
      }
    } catch (err) {
      // Absolutely never let this bubble to the ErrorBoundary
      console.error("[naturverse] RouteFX error (guarded):", err);
    }
  }, [pathname]);

  // No UI, so render nothing
  return null;
}
