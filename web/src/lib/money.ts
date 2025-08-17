export function natur(n: number) {
  // Ensure non-negative, clamp tiny floats, 2 dp display
  const v = Math.max(0, Number.isFinite(n) ? n : 0);
  return Number(v.toFixed(2));
}

export function fmtNatur(n: number) {
  return `${natur(n).toFixed(2)} NATUR`;
}
