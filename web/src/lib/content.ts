// Minimal, dependency-free content loader using Vite glob
export type Doc = {
  id: string;
  title: string;
  description?: string;
  image?: string;
  slug?: string;
  body?: string;
  // section-specific fields allowed (kept open)
  [key: string]: any;
};

export type Section =
  | 'stories' | 'quizzes' | 'observations' | 'tips'
  | 'zones' | 'worlds' | 'market'
  | 'games';

type ContentIndex = Record<Section, Doc[]>;

const files = import.meta.glob('../../content/**/*.json', { eager: true, import: 'default' }) as Record<string, Doc[] | Doc>;

function normalize(): ContentIndex {
  const index: Partial<ContentIndex> = {};
  const put = (k: Section, docs: Doc[]) => {
    index[k] = (docs as Doc[]).map(d => ({
      ...d,
      slug: d.slug ?? d.id ?? (d.title || '').toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9\-]/g,'')
    }));
  };

  Object.entries(files).forEach(([path, data]) => {
    const name = path.split('/content/')[1]?.split('.json')[0] as Section | undefined;
    if (!name) return;
    const section = name as Section;
    const value = Array.isArray(data) ? data : [data];
    put(section, value as Doc[]);
  });

  // Ensure empty arrays for any missing section
  (['stories','quizzes','observations','tips','zones','worlds','market','games'] as Section[])
    .forEach(s => { index[s] ||= []; });

  // sort by optional "order" desc then title
  (Object.keys(index) as Section[]).forEach(s => {
    index[s] = (index[s] as Doc[]).slice().sort((a,b) =>
      (b.order ?? 0) - (a.order ?? 0) || (a.title || '').localeCompare(b.title || '')
    );
  });

  return index as ContentIndex;
}

export const content = normalize();

export function bySection(section: Section): Doc[] {
  return content[section];
}

export function find(section: Section, slug: string): Doc | undefined {
  return content[section].find(d => d.slug === slug || d.id === slug);
}
