const k = (n: string) => `nv:${n}`;
export const load = <T,>(n: string, f: T) => {
  try {
    return JSON.parse(localStorage.getItem(k(n)) || "");
  } catch {
    return f;
  }
};
export const save = (n: string, v: any) =>
  localStorage.setItem(k(n), JSON.stringify(v));
