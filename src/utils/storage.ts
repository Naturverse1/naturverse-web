const NS = "naturverse:v1";

export function get<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(`${NS}:${key}`);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function set<T>(key: string, value: T) {
  try {
    localStorage.setItem(`${NS}:${key}`, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent(`${NS}:changed`, { detail: { key } }));
  } catch {
    // ignore quota / private mode
  }
}

export function remove(key: string) {
  try {
    localStorage.removeItem(`${NS}:${key}`);
    window.dispatchEvent(new CustomEvent(`${NS}:changed`, { detail: { key } }));
  } catch {}
}
