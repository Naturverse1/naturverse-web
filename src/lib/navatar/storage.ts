import type { Navatar } from "./types";

const ACTIVE_KEY = "navatar.active";
const LIB_KEY = "navatar.library";

export function loadActive(): Navatar | null {
  try { return JSON.parse(localStorage.getItem(ACTIVE_KEY) || "null"); }
  catch { return null; }
}

export function saveActive(n: Navatar) {
  localStorage.setItem(ACTIVE_KEY, JSON.stringify(n));
  const lib = loadLibrary();
  const next = [n, ...lib.filter(x => x.id !== n.id)].slice(0, 100);
  localStorage.setItem(LIB_KEY, JSON.stringify(next));
}

export function loadLibrary(): Navatar[] {
  try { return JSON.parse(localStorage.getItem(LIB_KEY) || "[]"); }
  catch { return []; }
}
