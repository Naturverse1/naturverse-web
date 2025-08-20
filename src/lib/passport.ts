export type Stamp = { world: string; date: string };
export type Badge = { id: string; label: string; earnedAt: string };
export type Passport = {
  holder?: { name?: string; navatarType?: string; traits?: string[]; imageUrl?: string };
  xp: number;
  coins: number;
  stamps: Stamp[];
  badges: Badge[];
  nfts: { id: string; name: string; imageUrl?: string; fromNavatar?: boolean }[];
};

const KEY = "naturverse_passport";

export function loadPassport(): Passport {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as Passport;
  } catch {}
  return { xp: 0, coins: 0, stamps: [], badges: [], nfts: [] };
}

export function savePassport(p: Passport) {
  localStorage.setItem(KEY, JSON.stringify(p));
}

export function addStamp(world: string) {
  const p = loadPassport();
  if (!p.stamps.some(s => s.world === world)) {
    p.stamps.push({ world, date: new Date().toISOString() });
    p.xp += 25;
    savePassport(p);
  }
  return p;
}

export function addBadge(id: string, label: string) {
  const p = loadPassport();
  if (!p.badges.some(b => b.id === id)) {
    p.badges.push({ id, label, earnedAt: new Date().toISOString() });
    p.xp += 50;
    savePassport(p);
  }
  return p;
}

export function addCoins(amount: number) {
  const p = loadPassport();
  p.coins += amount;
  savePassport(p);
  return p;
}

export function mintLocalNFT(name: string, imageUrl?: string, fromNavatar?: boolean) {
  const p = loadPassport();
  const id = `nft_${Date.now()}`;
  p.nfts.push({ id, name, imageUrl, fromNavatar });
  p.xp += 10;
  savePassport(p);
  return { id, passport: p };
}

export function updateHolder(holder: Passport["holder"]) {
  const p = loadPassport();
  p.holder = { ...(p.holder || {}), ...holder };
  savePassport(p);
  return p;
}
