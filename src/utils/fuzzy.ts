export function score(query: string, text: string) {
  const q = query.trim().toLowerCase();
  const t = text.toLowerCase();
  if (!q) return 0;
  if (t.startsWith(q)) return 100 - (t.length - q.length);
  let i = 0, hits = 0;
  for (const c of t) {
    if (c === q[i]) {
      i++;
      hits++;
      if (i === q.length) break;
    }
  }
  return i === q.length ? 50 + hits : 0;
}
