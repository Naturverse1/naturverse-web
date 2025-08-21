export type Navatar = {
  name: string;
  species: string;
  base: string;
  emoji?: string;
  photo?: string;
};

const K = "naturverse.navatar.current.v1";

export function getCurrent(): Navatar | null {
  try {
    return JSON.parse(localStorage.getItem(K) || "null");
  } catch {
    return null;
  }
}

export function setCurrent(n: Navatar | null) {
  try {
    if (n) localStorage.setItem(K, JSON.stringify(n));
    else localStorage.removeItem(K);
  } catch {}
}
