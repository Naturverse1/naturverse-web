const BASE_KEYS = ['natur_cart', 'natur_orders', 'natur_profile', 'navatar'];
const PREFIXES = ['naturversity_', 'wellness_'];

function collectKeys(): string[] {
  const keys: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (!k) continue;
    if (BASE_KEYS.includes(k) || PREFIXES.some(p => k.startsWith(p))) {
      keys.push(k);
    }
  }
  return keys;
}

export function exportData() {
  const data: Record<string, unknown> = {};
  for (const k of collectKeys()) {
    const v = localStorage.getItem(k);
    if (v !== null) {
      try {
        data[k] = JSON.parse(v);
      } catch {
        data[k] = v;
      }
    }
  }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'naturverse-data.json';
  a.click();
  URL.revokeObjectURL(url);
}

export function clearData() {
  for (const k of collectKeys()) {
    localStorage.removeItem(k);
  }
}
