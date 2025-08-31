// Encodes an array like [{id, qty}] into a compact URL param
export type ShareLine = { id: string; qty: number };

export function encodeCart(lines: ShareLine[]) {
  const json = JSON.stringify(lines.map(l => ({ i: l.id, q: l.qty })));
  return encodeURIComponent(btoa(json));
}
export function decodeCart(encoded: string): ShareLine[] {
  try {
    const json = atob(decodeURIComponent(encoded));
    const arr = JSON.parse(json);
    return Array.isArray(arr) ? arr.map((x:any) => ({ id: x.i, qty: x.q })) : [];
  } catch { return []; }
}

export function getShareLink(lines: ShareLine[]) {
  const base = typeof window !== "undefined" ? window.location.origin : "";
  const param = encodeCart(lines);
  return `${base}/checkout?cart=${param}`;
}
