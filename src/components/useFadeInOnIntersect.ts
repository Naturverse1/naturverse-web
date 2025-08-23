import { useEffect, useRef } from "react";

export function useFadeInOnIntersect<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // If already complete (e.g., cached image), show immediately
    const tryShow = () => el.classList.add("is-visible");

    // Observe visibility
    const io = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) {
          // If it's an <img>, wait for load; else reveal immediately
          if ((el as HTMLImageElement).tagName === "IMG") {
            const img = el as HTMLImageElement;
            if (img.complete) tryShow();
            else img.addEventListener("load", tryShow, { once: true });
          } else {
            tryShow();
          }
          io.disconnect();
        }
      }),
      { rootMargin: "64px" } // start a bit before it scrolls in
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return ref;
}

