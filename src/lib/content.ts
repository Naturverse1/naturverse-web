import { parseFrontmatter } from "./markdown";
import type { Doc, DocMeta, ZoneId } from "../types/content";

const ctxMd = import.meta.glob("../content/**/*.md", { as: "raw" });
const ctxJson = import.meta.glob("../content/**/*.json", { as: "raw" });
function base(meta: any, slug: string): DocMeta {
  return {
    title: meta.title ?? slug,
    summary: meta.summary ?? "",
    zone: meta.zone,
    slug,
    tags: meta.tags ?? [],
    cover: meta.cover ?? "",
    order: Number(meta.order ?? 0)
  };
}

export async function getZoneDocs(zone: ZoneId): Promise<Doc[]> {
  const mdEntries = Object.entries(ctxMd).filter(([p]) => p.includes(`/content/${zone}/`));
  const jsonEntries = Object.entries(ctxJson).filter(([p]) => p.includes(`/content/${zone}/`));
  const docs: Doc[] = [];

  for (const [path, load] of mdEntries){
    const raw = await (load as any)();
    const { meta, text } = await parseFrontmatter(raw as string);
    const slug = path.split("/").pop()!.replace(/\.md$/, "");
    docs.push({ ...base(meta, slug), text });
  }
  for (const [path, load] of jsonEntries){
    const raw = await (load as any)();
    const meta = JSON.parse(raw as string);
    const slug = path.split("/").pop()!.replace(/\.json$/, "");
    docs.push({ ...base(meta, slug), data: meta.data ?? undefined });
  }
  return docs.sort((a,b)=>(a.order??0)-(b.order??0));
}

export async function getDoc(zone: ZoneId, slug: string): Promise<Doc|undefined>{
  const list = await getZoneDocs(zone);
  return list.find(d => d.slug === slug);
}
