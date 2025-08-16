import { useEffect, useState } from "react";

/** Reads both OS prefers-reduced-motion and our app's localStorage flag "reduce-motion" */
export default function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fromOS = !!media.matches;
    const fromApp = localStorage.getItem("reduce-motion") === "true";
    setReduced(fromOS || fromApp);

    const handler = () =>
      setReduced(
        window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
          localStorage.getItem("reduce-motion") === "true"
      );
    media.addEventListener?.("change", handler);
    window.addEventListener("storage", handler);
    return () => {
      media.removeEventListener?.("change", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  return reduced;
}
