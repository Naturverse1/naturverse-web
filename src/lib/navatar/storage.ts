export type ActiveNavatar = {
  id: string;
  name: string;
  imageUrl: string;
  createdAt: number;
};

const KEY = "naturverse.navatar.active.v1";

export function getActive(): ActiveNavatar | null {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "null");
  } catch {
    return null;
  }
}

export function setActive(n: ActiveNavatar | null) {
  try {
    if (n) localStorage.setItem(KEY, JSON.stringify(n));
    else localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}
