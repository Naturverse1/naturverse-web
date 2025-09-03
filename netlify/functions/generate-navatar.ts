import type { Handler } from "@netlify/functions";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

// --- env ---
const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;
const IMAGES_BUCKET = process.env.IMAGES_BUCKET || "avatars";

// --- clients ---
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

export const handler: Handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method Not Allowed" };
    }

    const { user_id, name, prompt } = JSON.parse(event.body || "{}") as {
      user_id?: string;
      name?: string;
      prompt: string;
    };

    if (!prompt) {
      return { statusCode: 400, body: JSON.stringify({ error: "Missing prompt" }) };
    }

    // --- Generate image (force base64) ---
    const img = await openai.images.generate({
      model: "gpt-image-1",
      prompt,
      size: "1024x1024",
      response_format: "b64_json"
    });

    const b64 = img.data[0]?.b64_json;
    if (!b64) {
      return { statusCode: 502, body: JSON.stringify({ error: "No image returned" }) };
    }

    // --- Upload to Supabase Storage ---
    const buffer = Buffer.from(b64, "base64");
    const fileName = `ai/${user_id ?? "anon"}-${Date.now()}.png`;

    const { error: upErr } = await supabase
      .storage
      .from(IMAGES_BUCKET)
      .upload(fileName, buffer, { contentType: "image/png", upsert: false });

    if (upErr) {
      return { statusCode: 500, body: JSON.stringify({ error: upErr.message }) };
    }

    const { data: pub } = supabase.storage.from(IMAGES_BUCKET).getPublicUrl(fileName);
    const image_url = pub.publicUrl;

    // --- DB insert ---
    const { data: row, error: insErr } = await supabase
      .from("avatars")
      .insert({
        user_id: user_id ?? null,
        name: name || "AI avatar",
        method: "ai",          // <-- matches your CHECK constraint
        image_url
      })
      .select("*")
      .single();

    if (insErr) {
      return { statusCode: 500, body: JSON.stringify({ error: insErr.message }) };
    }

    return { statusCode: 200, body: JSON.stringify(row) };
  } catch (e: any) {
    console.error("generate-navatar error", e);
    // Pass through structured OpenAI errors if present
    const code = e?.status || 500;
    const msg  = e?.message || e?.response?.data?.error?.message || "Unknown error";
    return { statusCode: code, body: JSON.stringify({ error: msg }) };
  }
};
