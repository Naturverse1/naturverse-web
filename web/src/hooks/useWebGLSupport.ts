import { useMemo } from "react";

let cached: boolean | null = null;

function detectWebGL(): boolean {
  if (cached !== null) return cached;
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
    cached = !!gl;
  } catch {
    cached = false;
  }
  return cached;
}

export default function useWebGLSupport(): boolean {
  return useMemo(() => detectWebGL(), []);
}
