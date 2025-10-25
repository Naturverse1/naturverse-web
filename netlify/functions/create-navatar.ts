// Netlify serverless function: AI generate + upload to Supabase + DB insert

import { OpenAI } from "openai";
import { createClient } from "@supabase/supabase-js";
import { v4 as uuid } from "uuid";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE! // server-side only
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
  organization: process.env.OPENAI_ORG,
  project: process.env.OPENAI_PROJECT
});

// small helper to always return JSON
const json = (status: number, body: any) => new Response(
  JSON.stringify(body),
  { status, headers: { "content-type": "application/json" } }
);

export default async (req: Request) => {
  try {
    if (req.method !== "POST") return json(405, { error: "Method not allowed" });

    let payload: any = null;
    try {
      payload = await req.json();
    } catch {
      return json(400, { error: "Invalid JSON payload" });
    }

    const { userId, name, prompt } = payload ?? {};
    if (!userId) return json(400, { error: "Missing userId" });
    if (!prompt) return json(400, { error: "Missing prompt" });

    // 1) Generate image
    const result = await openai.images.generate({
      model: "gpt-image-1",
      prompt,
      size: "1024x1024"
    });

    const b64 = result.data?.[0]?.b64_json;
    if (!b64) return json(502, { error: "OpenAI returned no image" });

    const bytes = Buffer.from(b64, "base64");

    // 2) Upload to Supabase storage
    const fileId = `${uuid()}.png`;
    const path = `users/${userId}/${fileId}`;
    const { error: upErr } = await supabase
      .storage.from(process.env.NAVATARS_BUCKET!)
      .upload(path, bytes, { contentType: "image/png", upsert: false });
    if (upErr) return json(502, { error: "Upload failed", detail: upErr.message });

    const { data: pub } = supabase.storage
      .from(process.env.NAVATARS_BUCKET!)
      .getPublicUrl(path);

    // 3) Insert DB row
    const { data: row, error: insErr } = await supabase
      .from("avatars")
      .insert({
        user_id: userId,
        name: name || null,
        image_url: pub.publicUrl,
        method: "ai"
      })
      .select()
      .single();

    if (insErr) return json(502, { error: "DB insert failed", detail: insErr.message });

    return json(200, { avatar: row });
  } catch (e: any) {
    return json(500, { error: "Server error", detail: e?.message ?? String(e) });
  }
};

