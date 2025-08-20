export type MD<T = Record<string, unknown>> = {
  meta: T;
  text: string; // plain content, not HTML (yet)
};

export async function parseFrontmatter<T = Record<string, unknown>>(raw: string): Promise<MD<T>> {
  const gm = (await import('gray-matter')).default;
  const { data, content } = gm(raw);
  return { meta: data as T, text: content };
}
