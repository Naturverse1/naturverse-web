import type { Handler } from "@netlify/functions";
import { createClient } from "@supabase/supabase-js";

export const handler: Handler = async () => {
  const BASE = process.env.PUBLIC_SITE_URL || process.env.URL || 'https://thenaturverse.com';
  const staticPaths = ['/', '/worlds', '/zones', '/marketplace', '/orders', '/quests'];
  const productSlugs = ['navatar-style-kit','breathwork-starter','naturverse-plushie','naturverse-tshirt','sticker-pack','seed-journal'];

  // Pull quest ids from index (fallback to local if no DB)
  let questSlugs: string[] = [];
  try {
    const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
    const { data } = await supabase.from("quests_index").select("id").limit(200);
    questSlugs = (data||[]).map((r:any)=>r.id);
  } catch {
    // local fallback
    const items = (await import("../../src/data/quests.json")).default as any[];
    questSlugs = items.map(x=>x.id);
  }

  const urls = [
    ...staticPaths.map(p => `<url><loc>${BASE}${p}</loc><changefreq>weekly</changefreq></url>`),
    ...productSlugs.map(s => `<url><loc>${BASE}/marketplace/${s}</loc><changefreq>weekly</changefreq></url>`),
    ...questSlugs.map(s => `<url><loc>${BASE}/quests/${s}</loc><changefreq>weekly</changefreq></url>`)
  ].join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;
  return { statusCode: 200, headers: { 'Content-Type':'application/xml' }, body: xml };
};
