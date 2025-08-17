// Sum coins saved by any game using keys like "nv:<game>:coins".
// Spending is tracked separately so we never mutate game saves.
const COIN_KEY_MATCH = /^nv:.*:coins$/;
const SPENT_KEY = "nv:spent:coins";

export function getPerGameTotal(): number {
  let total = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i)!;
    if (COIN_KEY_MATCH.test(k)) total += Number(localStorage.getItem(k) || 0);
  }
  return total;
}

export function getSpent(): number {
  return Number(localStorage.getItem(SPENT_KEY) || 0);
}

export function getAvailableCoins(): number {
  return Math.max(0, getPerGameTotal() - getSpent());
}

export function trySpend(cost: number): boolean {
  const avail = getAvailableCoins();
  if (cost > avail) return false;
  localStorage.setItem(SPENT_KEY, String(getSpent() + cost));
  return true;
}

// helpers to mark owned cosmetic items
export function isOwned(id: string): boolean {
  return localStorage.getItem(`nv:owned:${id}`) === "1";
}
export function setOwned(id: string, v = true) {
  localStorage.setItem(`nv:owned:${id}`, v ? "1" : "0");
}
