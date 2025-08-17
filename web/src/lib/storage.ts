export const getJSON = <T>(k: string, d: T): T => {
  try {
    return JSON.parse(localStorage.getItem(k) || "") as T;
  } catch {
    return d;
  }
};
export const setJSON = (k: string, v: any) => localStorage.setItem(k, JSON.stringify(v));

