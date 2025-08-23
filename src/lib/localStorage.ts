const KEY_ACTIVE = "naturverse.activeNavatar";
const KEY_LIBRARY = "naturverse.navatarLibrary";

export function loadActive<T>(): T | null {
  try { return JSON.parse(localStorage.getItem(KEY_ACTIVE) || "null"); } catch { return null; }
}
export function saveActive<T>(v: T | null) {
  if (v == null) localStorage.removeItem(KEY_ACTIVE);
  else localStorage.setItem(KEY_ACTIVE, JSON.stringify(v));
}

export function loadLibrary<T>(): T[] {
  try { return JSON.parse(localStorage.getItem(KEY_LIBRARY) || "[]"); } catch { return []; }
}
export function saveLibrary<T>(list: T[]) {
  localStorage.setItem(KEY_LIBRARY, JSON.stringify(list));
}
