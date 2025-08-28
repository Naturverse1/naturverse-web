export type Theme = 'blue' | 'green' | 'purple' | 'sunset';

const KEY = 'nv-theme';
const DEFAULT_THEME: Theme = 'blue';

export function getTheme(): Theme {
  const t = (localStorage.getItem(KEY) || '').trim() as Theme;
  return t || DEFAULT_THEME;
}

export function setTheme(next: Theme) {
  localStorage.setItem(KEY, next);
  applyTheme(next);
}

export function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme; // e.g. [data-theme="blue"]
}
