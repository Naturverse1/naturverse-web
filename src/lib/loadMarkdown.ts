import matter from "gray-matter";

export type FrontMatter = Record<string, unknown>;

export async function loadMarkdown(pathFromSrc: string): Promise<{
  content: string;
  data: FrontMatter;
}> {
  // pathFromSrc like "content/zones/wellness/intro.md"
  const url = new URL(`/${pathFromSrc}`, import.meta.url).href;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to load ${pathFromSrc}`);
  const raw = await res.text();
  const parsed = matter(raw);
  return { content: parsed.content, data: parsed.data as FrontMatter };
}
