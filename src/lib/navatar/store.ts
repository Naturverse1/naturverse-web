import type { Navatar } from "./types";

const CUR = "naturverse.navatar.current.v1";
const LIB = "naturverse.navatar.library.v1";

const read = <T>(k: string, d: T) => { try { return JSON.parse(localStorage.getItem(k) || "null") ?? d; } catch { return d; } };
const write = (k: string, v: unknown) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

export function getCurrent(): Navatar | null { return read<Navatar | null>(CUR, null); }
export function setCurrent(n: Navatar | null) { if (n) write(CUR, n); else localStorage.removeItem(CUR); }

export function list(): Navatar[] { return read<Navatar[]>(LIB, []); }
export function saveToLibrary(n: Navatar) {
  const items = list();
  items.unshift(n);
  write(LIB, items.slice(0, 25));
}
