const KEY = "naturverse.recent.v1";
export function pushRecent(sku: string) {
  const s = new Set<string>(JSON.parse(localStorage.getItem(KEY) || "[]"));
  s.delete(sku);
  s.add(sku);
  const arr = Array.from(s).slice(-12);
  localStorage.setItem(KEY, JSON.stringify(arr));
}
export function getRecent(): string[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}
