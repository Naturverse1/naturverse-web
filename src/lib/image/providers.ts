export type Provider = 'deepai' | 'stability';

export function getSelectedProvider(): Provider {
  const v = (localStorage.getItem('navatar:provider') || '').toLowerCase();
  return v === 'stability' ? 'stability' : 'deepai';
}

export function setSelectedProvider(p: Provider) {
  localStorage.setItem('navatar:provider', p);
}

export function haveDeepAI() {
  return !!import.meta.env.VITE_DEEPAI_API_KEY;
}
export function haveStability() {
  return !!(import.meta.env.VITE_STABILITY_API_KEY || import.meta.env.STABILITY_API_KEY);
}
