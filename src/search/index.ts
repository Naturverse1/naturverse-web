type Base = {
  id: string;
  type: "world" | "zone" | "product" | "quest";
  title: string;
  slug: string;
  summary: string;
  tags?: string[];
  url: string;
};

export type SearchDoc = Base;

export function tokenize(s: string): string[] {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function scoreOne(doc: SearchDoc, q: string): number {
  const hayTitle = doc.title.toLowerCase();
  const haySummary = doc.summary.toLowerCase();
  const haySlug = doc.slug.toLowerCase();
  const hayTags = (doc.tags || []).map(t => t.toLowerCase());

  const nq = q.toLowerCase();

  let score = 0;
  if (hayTitle.includes(nq)) score += 10;
  if (haySlug.includes(nq)) score += 6;
  if (haySummary.includes(nq)) score += 3;
  if (hayTags.some(t => t.includes(nq))) score += 4;

  // small token match bonus
  const tokens = tokenize(q);
  for (const t of tokens) {
    if (hayTitle.includes(t)) score += 3;
    if (haySummary.includes(t)) score += 1;
  }
  return score;
}

export function search(docs: SearchDoc[], query: string, limit = 20): SearchDoc[] {
  if (!query.trim()) return [];
  const q = query.trim();
  const scored = docs
    .map(d => ({ d, s: scoreOne(d, q) }))
    .filter(x => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, limit)
    .map(x => x.d);
  return scored;
}

