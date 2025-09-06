export function saveActive(value: any, key = "navatarActive") {
  localStorage.setItem(key, JSON.stringify(value));
}

export function loadActive<T = any>(key = "navatarActive"): T | undefined {
  const raw = localStorage.getItem(key);
  return raw ? (JSON.parse(raw) as T) : undefined;
}

