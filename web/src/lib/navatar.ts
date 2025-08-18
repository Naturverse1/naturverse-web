const KEY = 'navatar_url';
const META = 'navatar_updatedAt';

export function saveNavatar(dataUrl: string) {
  localStorage.setItem(KEY, dataUrl);
  localStorage.setItem(META, String(Date.now()));
}

export function getNavatar(): string | null {
  return localStorage.getItem(KEY);
}

export function clearNavatar() {
  localStorage.removeItem(KEY);
  localStorage.removeItem(META);
}
