const K = {
  stamps: "naturverse.passport.stamps.v1",
  badges: "naturverse.passport.badges.v1",
  xp:     "naturverse.passport.xp.v1",
  coin:   "naturverse.passport.natur.v1",
};

const read = <T>(k: string, d: T) => { try { return JSON.parse(localStorage.getItem(k) || "null") ?? d; } catch { return d; } };
const write = (k: string, v: unknown) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

export type Badge = { id: string; title: string; emoji: string; desc: string; };

export function getStamps(): string[] { return read<string[]>(K.stamps, []); }
export function toggleStamp(id: string) {
  const s = new Set(getStamps());
  s.has(id) ? s.delete(id) : s.add(id);
  write(K.stamps, [...s]);
}

export function getBadges(): Badge[] { return read<Badge[]>(K.badges, []); }
export function addBadge(b: Badge) {
  const list = getBadges();
  if (!list.find(x => x.id === b.id)) { list.unshift(b); write(K.badges, list.slice(0, 50)); }
}

export function getXP(): number { return read<number>(K.xp, 0); }
export function addXP(n: number) { write(K.xp, Math.max(0, getXP() + n)); }

export function getNatur(): number { return read<number>(K.coin, 0); }
export function addNatur(n: number) { write(K.coin, Math.max(0, getNatur() + n)); }
