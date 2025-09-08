const NV_ACTIVE_KEY = 'nv.activeNavatarId';

export function setActiveNavatarId(id: string) {
  try { localStorage.setItem(NV_ACTIVE_KEY, id); } catch {}
}

export function getActiveNavatarId(): string | null {
  try { return localStorage.getItem(NV_ACTIVE_KEY); } catch { return null; }
}

export function clearActiveNavatarId() {
  try { localStorage.removeItem(NV_ACTIVE_KEY); } catch {}
}
