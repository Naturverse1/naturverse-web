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
    const rawPush = history.pushState;
    const rawReplace = history.replaceState;
    const origPush = rawPush.bind(history);
    const origReplace = rawReplace.bind(history);

    function fireNavEvent() {
      window.dispatchEvent(new Event("naturverse:navigation"));
    }

    const push: typeof history.pushState = (...args) => {
      const ret = origPush(...args);
      fireNavEvent();
      return ret;
    };

    const replace: typeof history.replaceState = (...args) => {
      const ret = origReplace(...args);
      fireNavEvent();
      return ret;
    };

    history.pushState = push;
    history.replaceState = replace;

    const onPop = () => fireNavEvent();
    const onNV = () => runEffects();

    window.addEventListener("popstate", onPop);
    window.addEventListener("naturverse:navigation", onNV);

    return () => {
      // Cleanup & restore originals
      history.pushState = rawPush;
      history.replaceState = rawReplace;
      window.removeEventListener("popstate", onPop);
      window.removeEventListener("naturverse:navigation", onNV);
    };
  }, []);

  return null;
}

