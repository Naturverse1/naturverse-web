import type { Handler } from "@netlify/functions";

const CONTENT = {
  zones: [
    { slug:"music", title:"Music", blurb:"Playlists, rhythm games, and instruments." },
    { slug:"wellness", title:"Wellness", blurb:"Breathing, stretching, and mindfulness quests." },
    { slug:"creator-lab", title:"Creator Lab", blurb:"Make stories, art, code, and music." },
    { slug:"community", title:"Community", blurb:"Clubs, challenges, and events." },
    { slug:"teachers", title:"Teachers", blurb:"Class packs and resources." },
    { slug:"partners", title:"Partners", blurb:"Collaborations and programs." },
    { slug:"naturversity", title:"Naturversity", blurb:"Courses and learning paths." },
    { slug:"parents", title:"Parents", blurb:"Dashboard and safety controls." },
  ],
  products: [
    { id:"kit-1", name:"Explorer Kit", price:29, emoji:"🧭", desc:"Nature journal, stickers, and field tasks." },
    { id:"cards-1", name:"Creature Cards", price:19, emoji:"🦊", desc:"Collectible animal facts deck." },
    { id:"tee-1", name:"Leaf Tee", price:24, emoji:"👕", desc:"Soft tee with Naturverse leaf." }
  ],
  stories: [
    { id:"st-1", title:"Panda and the Bamboo Flute", body:"..." },
    { id:"st-2", title:"Mangoes for the Tiger", body:"..." }
  ]
};

export const handler: Handler = async () => {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE;
  if (!(url && key)) return { statusCode: 200, body: JSON.stringify({ seeded:false, reason:"No Supabase service key." }) };

  const upsert = async (table: string, rows: any[]) => {
    const res = await fetch(`${url}/rest/v1/${table}`, {
      method: "POST",
      headers: {
        "apikey": key, "Authorization": `Bearer ${key}`,
        "Content-Type":"application/json", "Prefer":"resolution=merge-duplicates"
      },
      body: JSON.stringify(rows)
    });
    if (!res.ok) throw new Error(`${table}: ${res.status} ${await res.text()}`);
  };

  await upsert("nv_zones", CONTENT.zones.map(z=>({ id:z.slug, ...z })));
  await upsert("nv_products", CONTENT.products);
  await upsert("nv_stories", CONTENT.stories);

  return { statusCode: 200, body: JSON.stringify({ seeded:true }) };
};
