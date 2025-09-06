// Loads list of built-in navatar images from /public/navatars/index.json
export type CatalogItem = { src: string; title?: string };
export async function loadCatalog(): Promise<CatalogItem[]> {
  try {
    const res = await fetch("/navatars/index.json", { cache: "no-store" });
    if (!res.ok) throw new Error("no manifest");
    const files: string[] = await res.json();
    return files.map(f => ({ src: `/navatars/${f}` }));
  } catch {
    // Soft fallback: empty list with a hint
    return [];
  }
}
