export type ThemePref = 'light' | 'dark' | 'system';

function applyTheme(theme: 'light' | 'dark') {
  document.documentElement.dataset.theme = theme;
}

export function getTheme(): ThemePref {
  return (localStorage.getItem('theme') as 'light' | 'dark') || 'system';
}

export function setTheme(t: ThemePref) {
  if (t === 'system') {
    localStorage.removeItem('theme');
    applyThemeFromStorage();
  } else {
    localStorage.setItem('theme', t);
    applyTheme(t);
  }
}

export function applyThemeFromStorage() {
  const stored = localStorage.getItem('theme') as 'light' | 'dark' | null;
  const theme = stored ?? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  applyTheme(theme);
}

export function getReducedMotion(): boolean {
  return localStorage.getItem('reducedMotion') === 'true';
}

export function setReducedMotion(on: boolean) {
  localStorage.setItem('reducedMotion', on ? 'true' : 'false');
  applyReducedMotion(on);
}

export function applyReducedMotion(on: boolean) {
  document.documentElement.classList.toggle('reduced-motion', on);
}

export function applyReducedMotionFromStorage() {
  applyReducedMotion(getReducedMotion());
}
