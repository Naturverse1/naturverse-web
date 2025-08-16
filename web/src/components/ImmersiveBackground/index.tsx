import React, { useEffect, useState } from "react";
import useReducedMotion from "@/hooks/useReducedMotion";
import GradientBackdrop from "./GradientBackdrop";
import VignetteOverlay from "./VignetteOverlay";
import StarfieldCanvas from "./StarfieldCanvas";

/**
 * Modes:
 *   - "off": only gradient + vignette
 *   - "canvas": adds starfield (disabled if reduced motion)
 *
 * Setting stored in localStorage "immersive-mode"
 */
export default function ImmersiveBackground() {
  const reduced = useReducedMotion();
  const [mode, setMode] = useState<"off" | "canvas">("canvas");

  useEffect(() => {
    const fromLS =
      (localStorage.getItem("immersive-mode") as "off" | "canvas" | null) ||
      "canvas";
    setMode(fromLS);
    const onStorage = () => {
      const v = (localStorage.getItem("immersive-mode") as any) || "canvas";
      setMode(v === "off" ? "off" : "canvas");
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const canvasOn = mode === "canvas" && !reduced;

  return (
    <>
      <GradientBackdrop />
      <StarfieldCanvas enabled={canvasOn} />
      <VignetteOverlay />
    </>
  );
}
