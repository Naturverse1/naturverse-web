import type { Handler } from "@netlify/functions";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;
const BUCKET = process.env.IMAGES_BUCKET || "avatars";

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

function dataUrlToBuffer(dataUrl?: string | null) {
  if (!dataUrl) return undefined;
  // data:image/png;base64,AAAA...
  const comma = dataUrl.indexOf(",");
  const b64 = comma >= 0 ? dataUrl.slice(comma + 1) : dataUrl;
  return Buffer.from(b64, "base64");
}

export const handler: Handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method Not Allowed" };
    }

    const { prompt, name, userId, sourceDataUrl, maskDataUrl } = JSON.parse(
      event.body || "{}"
    ) as {
      prompt?: string;
      name?: string;
      userId?: string;
      sourceDataUrl?: string | null; // data URL (optional)
      maskDataUrl?: string | null; // data URL (optional)
    };

    if (!prompt && !sourceDataUrl) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Provide prompt or a source image." }),
        headers: { "content-type": "application/json" },
      };
    }

    // ---- 1) Generate/Edit image via OpenAI (NO response_format param) ----
    let b64: string | undefined;

    if (sourceDataUrl) {
      const imageBuf = dataUrlToBuffer(sourceDataUrl)!;
      const maskBuf = dataUrlToBuffer(maskDataUrl || undefined);

      const resp = await openai.images.edits({
        model: "gpt-image-1",
        prompt: prompt || "",
        image: imageBuf,
        ...(maskBuf ? { mask: maskBuf } : {}),
        size: "1024x1024",
      });

      b64 = resp.data?.[0]?.b64_json;
    } else {
      const resp = await openai.images.generate({
        model: "gpt-image-1",
        prompt: prompt!,
        size: "1024x1024",
      });
      b64 = resp.data?.[0]?.b64_json;
    }

    if (!b64) {
      return {
        statusCode: 502,
        body: JSON.stringify({ error: "Image generation failed" }),
        headers: { "content-type": "application/json" },
      };
    }

    // ---- 2) Upload to Supabase Storage ----
    const buffer = Buffer.from(b64, "base64");
    const filename = `ai/${userId || "anon"}/${Date.now()}.png`;

    const { error: upErr } = await supabase.storage
      .from(BUCKET)
      .upload(filename, buffer, { contentType: "image/png", upsert: false });

    if (upErr) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: upErr.message }),
        headers: { "content-type": "application/json" },
      };
    }

    const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(filename);
    const image_url = pub.publicUrl;

    // ---- 3) Insert DB row ----
    const { error: insErr } = await supabase
      .from("avatars")
      .insert({
        user_id: userId || null,
        name: name || "AI avatar",
        category: "generate",
        method: "ai", // allowed by your updated CHECK constraint
        image_url,
        image_path: filename,
        is_public: false,
        is_primary: false,
        status: "ready",
      })
      .select("*")
      .single();

    if (insErr) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: insErr.message }),
        headers: { "content-type": "application/json" },
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ image_url }),
      headers: { "content-type": "application/json" },
    };
  } catch (e: any) {
    const msg =
      e?.response?.data?.error?.message || e?.message || "Unknown error";
    const code = e?.status || 500;
    return {
      statusCode: code,
      body: JSON.stringify({ error: msg }),
      headers: { "content-type": "application/json" },
    };
  }
};

