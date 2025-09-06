// util for safe local storage of the active Navatar UUID
const KEY = "nv:active_navatar";

const isUUID = (v: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);

export function setActiveNavatar(id: string) {
  if (id && isUUID(id)) localStorage.setItem(KEY, id);
}

export function loadActiveNavatar(): string | null {
  const v = localStorage.getItem(KEY);
  return v && isUUID(v) ? v : null;
}

export function clearLegacyKeys() {
  // remove any non-UUID legacy values
  ["nv:active_navatar", "naturverse.activeAvatar", "naturverse.activeNavatar"]
    .forEach(k => localStorage.removeItem(k));
}
