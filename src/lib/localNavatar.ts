const KEY = "nv.activeNavatarId";

export function loadActive(): string | null {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

export function saveActive(id: string) {
  try {
    localStorage.setItem(KEY, id);
  } catch {}
}

