import type { Handler } from "@netlify/functions";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

/** --- Env --- */
const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;
const IMAGES_BUCKET = process.env.IMAGES_BUCKET || "avatars";

/** --- Clients --- */
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

/** Fetch any remote URL into a Buffer */
async function toBuffer(url: string): Promise<Buffer> {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`Fetch failed: ${r.status} ${r.statusText}`);
  const ab = await r.arrayBuffer();
  return Buffer.from(ab);
}

export const handler: Handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method Not Allowed" };
    }

    const { prompt, user_id, name, sourceImageUrl, maskImageUrl } = JSON.parse(event.body || "{}") as {
      prompt?: string;
      user_id?: string;
      name?: string;
      sourceImageUrl?: string;
      maskImageUrl?: string;
    };

    if (!prompt && !sourceImageUrl) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Provide a prompt or a sourceImageUrl." }),
        headers: { "content-type": "application/json" },
      };
    }

    // ---- 1) Generate or Edit (no response_format passed; default is b64_json) ----
    let b64: string;

    if (sourceImageUrl) {
      // EDIT route (optionally with mask)
      const imageBuf = await toBuffer(sourceImageUrl);
      const maskBuf = maskImageUrl ? await toBuffer(maskImageUrl) : undefined;

      const edit = await openai.images.edits({
        model: "gpt-image-1",
        prompt: prompt || "",
        image: [imageBuf],
        ...(maskBuf ? { mask: maskBuf } : {}),
        size: "1024x1024",
      });

      b64 = edit.data?.[0]?.b64_json || "";
    } else {
      // PURE GENERATION route
      const gen = await openai.images.generate({
        model: "gpt-image-1",
        prompt: prompt!,
        size: "1024x1024",
      });

      b64 = gen.data?.[0]?.b64_json || "";
    }

    if (!b64) {
      return {
        statusCode: 502,
        body: JSON.stringify({ error: "No image data returned from OpenAI." }),
        headers: { "content-type": "application/json" },
      };
    }

    // ---- 2) Upload to Supabase Storage ----
    const buffer = Buffer.from(b64, "base64");
    const timestamp = Date.now();
    const folder = user_id ? `ai/${user_id}` : "ai/anon";
    const filename = `${folder}/${timestamp}.png`;

    const { error: upErr } = await supabase.storage
      .from(IMAGES_BUCKET)
      .upload(filename, buffer, {
        contentType: "image/png",
        upsert: true,
        cacheControl: "public, max-age=31536000, immutable",
      });

    if (upErr) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: `Upload failed: ${upErr.message}` }),
        headers: { "content-type": "application/json" },
      };
    }

    const pub = supabase.storage.from(IMAGES_BUCKET).getPublicUrl(filename);
    const image_url = pub?.data?.publicUrl;
    if (!image_url) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Could not resolve public URL." }),
        headers: { "content-type": "application/json" },
      };
    }

    // ---- 3) Save DB row (last-write-wins) ----
    const { error: dbErr } = await supabase
      .from("avatars")
      .upsert(
        {
          user_id: user_id ?? null,
          name: name || "AI avatar",
          category: "generate",
          method: "ai",
          image_url,
        },
        { onConflict: "user_id", ignoreDuplicates: false }
      );

    if (dbErr) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: `DB upsert failed: ${dbErr.message}` }),
        headers: { "content-type": "application/json" },
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ image_url }),
      headers: { "content-type": "application/json" },
    };
  } catch (e: any) {
    // Bubble meaningful OpenAI errors when possible
    const code = e?.status || 500;
    const message =
      e?.response?.data?.error?.message ||
      e?.message ||
      "Unknown server error";
    return {
      statusCode: code,
      body: JSON.stringify({ error: message }),
      headers: { "content-type": "application/json" },
    };
  }
};

