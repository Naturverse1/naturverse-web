import { NAVATARS } from '../data/navatars';
export function getNavatarMeta(id?: string | null) {
  if (!id) return null;
  return NAVATARS.find(n => n.id === id) ?? null;
}
