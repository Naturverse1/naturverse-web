export function toQuery(f: any) {
  const p = new URLSearchParams();
  if (f.q) p.set('q', f.q);
  if (f.cats?.length) p.set('cats', f.cats.join(','));
  if (f.min != null) p.set('min', String(f.min));
  if (f.max != null) p.set('max', String(f.max));
  if (f.sort) p.set('sort', f.sort);
  return `?${p.toString()}`;
}
export function fromQuery(s: string) {
  const p = new URLSearchParams(s);
  return {
    q: p.get('q') || '',
    cats: (p.get('cats') || '').split(',').filter(Boolean),
    min: p.get('min') ? Number(p.get('min')) : undefined,
    max: p.get('max') ? Number(p.get('max')) : undefined,
    sort: (p.get('sort') || 'relevance') as any,
  };
}

