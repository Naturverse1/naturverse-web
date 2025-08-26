import { useEffect } from "react";

/**
 * RouteFX (safe)
 * - No react-router hooks (so it can mount anywhere, even outside <Router>)
 * - Watches URL changes via history & popstate
 * - Runs tiny, guarded side effects (scroll-to-top, focus <main>)
 * - Can never crash render; always returns null
 */
export default function RouteFX(): null {
  useEffect(() => {
    function runEffects() {
      try {
        // Scroll to top (prefer smooth when available)
        try {
          window.scrollTo({ top: 0, left: 0, behavior: "smooth" as ScrollBehavior });
        } catch {
          window.scrollTo(0, 0);
        }

        // Focus main for a11y (don’t throw if missing)
        const main = document.querySelector("main") as HTMLElement | null;
        if (main) {
          if (!main.hasAttribute("tabindex")) main.setAttribute("tabindex", "-1");
          try {
            main.focus({ preventScroll: true });
          } catch {
            main.focus();
          }
        }
      } catch (err) {
        // Never throw from here
        console.warn("[Naturverse] RouteFX suppressed error:", err);
      }
    }

    // Initial run
    if (typeof window !== "undefined" && typeof document !== "undefined") {
      runEffects();
    }

    // Listen for route changes without react-router
    const origPush = history.pushState;
    const origReplace = history.replaceState;

    function fireNavEvent() {
      window.dispatchEvent(new Event("naturverse:navigation"));
    }

    history.pushState = function (...args) {
      const ret = origPush.apply(this, args as any);
      fireNavEvent();
      return ret;
    } as any;

    history.replaceState = function (...args) {
      const ret = origReplace.apply(this, args as any);
      fireNavEvent();
      return ret;
    } as any;

    const onPop = () => fireNavEvent();
    const onNV = () => runEffects();

    window.addEventListener("popstate", onPop);
    window.addEventListener("naturverse:navigation", onNV);

    return () => {
      // Cleanup & restore originals
      history.pushState = origPush;
      history.replaceState = origReplace;
      window.removeEventListener("popstate", onPop);
      window.removeEventListener("naturverse:navigation", onNV);
    };
  }, []);

  return null;
}

