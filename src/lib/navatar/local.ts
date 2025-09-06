const ACTIVE_KEY = "nv_active_navatar";
const LIB_KEY = "nv_navatar_lib";

export function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

export function loadActive<T>() {
  try { return JSON.parse(localStorage.getItem(ACTIVE_KEY) || "null") as T | null; }
  catch { return null; }
}

export function saveActive<T>(v: T) {
  localStorage.setItem(ACTIVE_KEY, JSON.stringify(v));
}

export function loadLibrary<T>() {
  try { return JSON.parse(localStorage.getItem(LIB_KEY) || "[]") as T[]; }
  catch { return []; }
}

export function saveLibrary<T>(arr: T[]) {
  localStorage.setItem(LIB_KEY, JSON.stringify(arr));
}
