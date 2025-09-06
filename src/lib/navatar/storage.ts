const ACTIVE_KEY = "nv_active_navatar_v1";
export function saveActive(n: any) {
  localStorage.setItem(ACTIVE_KEY, JSON.stringify(n));
}
export function loadActive<T>() : T | null {
  const raw = localStorage.getItem(ACTIVE_KEY);
  return raw ? JSON.parse(raw) as T : null;
}
