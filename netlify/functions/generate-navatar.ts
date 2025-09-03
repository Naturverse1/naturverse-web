import type { Handler } from "@netlify/functions";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;
const IMAGES_BUCKET = process.env.IMAGES_BUCKET || "avatars";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

// helper → fetch a public image URL into a Buffer (for OpenAI edits)
async function fetchAsBuffer(url: string) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`Fetch failed: ${r.status}`);
  const ab = await r.arrayBuffer();
  return Buffer.from(ab);
}

export const handler: Handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: JSON.stringify({ error: "Method not allowed" }) };
    }

    const body = JSON.parse(event.body || "{}") as {
      user_id?: string;
      name?: string;
      prompt?: string;
      source_public_url?: string; // optional
      mask_public_url?: string; // optional
    };

    const { user_id, name, prompt, source_public_url, mask_public_url } = body;
    if (!prompt && !source_public_url) {
      return { statusCode: 400, body: JSON.stringify({ error: "Provide a prompt or a source image." }) };
    }

    // --- 1) Generate / Edit with OpenAI ---
    let b64: string | undefined;

    if (source_public_url) {
      // EDIT flow
      const image = await fetchAsBuffer(source_public_url);
      const mask = mask_public_url ? await fetchAsBuffer(mask_public_url) : undefined;

      const res = await openai.images.edits({
        model: "gpt-image-1",
        prompt: prompt || "", // prompt optional for edits
        image,
        ...(mask ? { mask } : {}),
        size: "1024x1024",
      });

      b64 = res.data?.[0]?.b64_json;
    } else {
      // PURE GENERATION
      const res = await openai.images.generate({
        model: "gpt-image-1",
        prompt: prompt!,
        size: "1024x1024",
      });
      b64 = res.data?.[0]?.b64_json;
    }

    if (!b64) {
      return { statusCode: 502, body: JSON.stringify({ error: "OpenAI returned no image." }) };
    }

    // --- 2) Upload to Supabase Storage ---
    const buffer = Buffer.from(b64, "base64");
    const filePath = `ai/${user_id ?? "anon"}/${Date.now()}.png`;

    const { error: upErr } = await supabase
      .storage
      .from(IMAGES_BUCKET)
      .upload(filePath, buffer, { contentType: "image/png", upsert: false });

    if (upErr) {
      return { statusCode: 500, body: JSON.stringify({ error: `Upload failed: ${upErr.message}` }) };
    }

    const { data: pub } = supabase.storage.from(IMAGES_BUCKET).getPublicUrl(filePath);
    const image_url = pub?.publicUrl;
    if (!image_url) {
      return { statusCode: 500, body: JSON.stringify({ error: "Could not resolve public URL." }) };
    }

    // --- 3) Insert DB row ---
    const { error: insErr, data: row } = await supabase
      .from("avatars")
      .insert({
        user_id: user_id ?? null,
        name: name || "AI avatar",
        category: "generate",
        method: "ai",
        image_url,
        image_path: filePath,
        is_primary: false,
        is_public: true,
        status: "ready",
        status_message: null,
      })
      .select("*")
      .single();

    if (insErr) {
      return { statusCode: 500, body: JSON.stringify({ error: `DB upsert failed: ${insErr.message}` }) };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ image_url, id: row.id }),
      headers: { "content-type": "application/json" },
    };
  } catch (e: any) {
    const status = e?.status || 500;
    const msg =
      e?.response?.data?.error?.message ||
      e?.message ||
      "Unknown error";
    return { statusCode: status, body: JSON.stringify({ error: msg }) };
  }
};

