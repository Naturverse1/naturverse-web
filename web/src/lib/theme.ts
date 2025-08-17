export function isOwned(id: string): boolean {
  return localStorage.getItem(`nv:owned:${id}`) === "1";
}
export type ThemeId = "theme-aurora" | "theme-jungle" | "theme-none";
export function getActiveTheme(): ThemeId {
  if (isOwned("theme-aurora")) return "theme-aurora";
  if (isOwned("theme-jungle")) return "theme-jungle";
  return "theme-none";
}
export function applyTheme() {
  const t = getActiveTheme();
  document.body.setAttribute("data-theme", t);
}
export function onThemeChange(cb: () => void) {
  const handler = () => cb();
  window.addEventListener("storage", handler);
  return () => window.removeEventListener("storage", handler);
}
