const KEY = 'nv_recent_v1';
const LIMIT = 20;

function read(): string[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]');
  } catch {
    return [];
  }
}

function write(ids: string[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(ids.slice(0, LIMIT)));
  } catch {}
  try {
    window.dispatchEvent(new CustomEvent('recent:update', { detail: ids }));
  } catch {}
}

export function pushRecent(id: string) {
  const cur = read().filter(x => x !== id);
  cur.unshift(id);
  write(cur);
  console.log('recent_view_push', { id });
}

export function getRecent(): string[] {
  return read();
}

export function clearRecent() {
  write([]);
}
