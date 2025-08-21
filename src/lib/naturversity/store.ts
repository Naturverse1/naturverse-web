const EK = "naturverse.edu.enrolled.v1";   // string[] course slugs
const PK = "naturverse.edu.progress.v1";   // { [slug]: string[] lessonIds }

const read = <T>(k: string, d: T) => {
  try { return JSON.parse(localStorage.getItem(k) || "null") ?? d; } catch { return d; }
};
const write = (k: string, v: unknown) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

export function loadEnrollments(): string[] { return read<string[]>(EK, []); }
export function toggleEnroll(slug: string) {
  const s = new Set(loadEnrollments());
  s.has(slug) ? s.delete(slug) : s.add(slug);
  write(EK, [...s]); return [...s];
}

export function loadProgress(slug: string): string[] {
  const p = read<Record<string, string[]>>(PK, {});
  return p[slug] ?? [];
}
export function markLesson(slug: string, id: string) {
  const p = read<Record<string, string[]>>(PK, {});
  const set = new Set(p[slug] ?? []);
  set.has(id) ? set.delete(id) : set.add(id);
  p[slug] = [...set]; write(PK, p);
  return p[slug];
}

