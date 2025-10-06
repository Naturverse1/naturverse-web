export type Provider = 'openai' | 'huggingface' | 'deepai' | 'basic';

const STORAGE_KEY = 'navatar:provider';

export function getSelectedProvider(): Provider {
  const value = (localStorage.getItem(STORAGE_KEY) || '').toLowerCase();
  if (value === 'huggingface' || value === 'deepai' || value === 'basic') {
    return value;
  }
  return 'openai';
}

export function setSelectedProvider(provider: Provider) {
  localStorage.setItem(STORAGE_KEY, provider);
}
