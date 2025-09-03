// netlify/functions/generate-navatar.ts
import type { Handler } from "@netlify/functions";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;
const IMAGES_BUCKET = process.env.IMAGES_BUCKET || "avatars";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

async function fetchAsBuffer(url: string) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`Fetch failed: ${r.status} ${r.statusText}`);
  const ab = await r.arrayBuffer();
  return Buffer.from(ab);
}

export const handler: Handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method not allowed" };
    }

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return { statusCode: 500, body: "Server misconfig: missing Supabase env" };
    }
    if (!OPENAI_API_KEY) {
      return { statusCode: 500, body: "Server misconfig: missing OPENAI_API_KEY" };
    }

    const { prompt, userId, name, sourceImageUrl, maskImageUrl } = JSON.parse(event.body || "{}") as {
      prompt?: string;
      userId?: string;
      name?: string;
      sourceImageUrl?: string;
      maskImageUrl?: string;
    };

    if (!userId) return { statusCode: 400, body: "Missing userId" };
    if (!prompt && !sourceImageUrl) return { statusCode: 400, body: "Provide prompt or sourceImageUrl" };

    // ---- 1) Generate or Edit image (no response_format param) ----
    let b64: string | undefined;

    if (sourceImageUrl) {
      const image = await fetchAsBuffer(sourceImageUrl);
      const mask = maskImageUrl ? await fetchAsBuffer(maskImageUrl) : undefined;

      const edit = await openai.images.edits({
        model: "gpt-image-1",
        prompt: prompt || "",
        image,
        ...(mask ? { mask } : {}),
        size: "1024x1024",
      });

      b64 = edit.data?.[0]?.b64_json;
    } else {
      const gen = await openai.images.generate({
        model: "gpt-image-1",
        prompt: prompt!,
        size: "1024x1024",
      });
      b64 = gen.data?.[0]?.b64_json;
    }

    if (!b64) {
      return { statusCode: 502, body: "OpenAI image generation returned empty" };
    }

    // ---- 2) Upload to Supabase Storage ----
    const buffer = Buffer.from(b64, "base64");
    const path = `${userId}/${Date.now()}.png`;

    const { error: upErr, data: pub } = await supabase.storage
      .from(IMAGES_BUCKET)
      .upload(path, buffer, {
        contentType: "image/png",
        cacheControl: "public, max-age=31536000, immutable",
        upsert: true,
      });

    if (upErr) {
      return { statusCode: 500, body: `Upload failed: ${upErr.message}` };
    }

    const image_url = pub?.publicUrl;
    if (!image_url) {
      return { statusCode: 500, body: "Could not resolve public URL" };
    }

    // ---- 3) Upsert DB row ----
    const { error: dbErr } = await supabase
      .from("avatars")
      .upsert(
        {
          user_id: userId,
          name: name || "Navatar",
          category: "generate",
          method: "generate",
          image_url,
        },
        { onConflict: "user_id" }
      );

    if (dbErr) {
      return { statusCode: 500, body: `DB upsert failed: ${dbErr.message}` };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ image_url }),
      headers: { "content-type": "application/json" },
    };
  } catch (e: any) {
    const msg = e?.message || "Unknown error";
    return {
      statusCode: 500,
      body: JSON.stringify({ error: msg }),
      headers: { "content-type": "application/json" },
    };
  }
};
