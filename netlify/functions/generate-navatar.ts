import type { Handler } from "@netlify/functions";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;

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

    // Generate image (no response_format param – it 400s on the latest SDK)
    const img = await openai.images.generate({
      model: "gpt-image-1",
      prompt,
      size: "1024x1024"
    });

    const b64 = img.data?.[0]?.b64_json;
    if (!b64) {
      return { statusCode: 502, body: JSON.stringify({ error: "No image returned" }) };
    }

    const buffer = Buffer.from(b64, "base64");
    const fileName = `ai/${user_id ?? "anon"}/${crypto.randomUUID()}.png`;

    const { error: upErr } = await supabase
      .storage
      .from("avatars")
      .upload(fileName, buffer, { contentType: "image/png", upsert: false });

    if (upErr) {
      return { statusCode: 500, body: JSON.stringify({ error: `Upload failed: ${upErr.message}` }) };
    }

    const { data: pub } = supabase.storage.from("avatars").getPublicUrl(fileName);
    const image_url = pub.publicUrl;

    const { error: insErr, data: row } = await supabase
      .from("avatars")
      .insert({
        user_id: user_id ?? null,
        name: name || "AI avatar",
        method: "ai",
        image_url
      })
      .select("*")
      .single();

    if (insErr) {
      return { statusCode: 500, body: JSON.stringify({ error: `DB insert failed: ${insErr.message}` }) };
    }

    return { statusCode: 200, body: JSON.stringify({ avatar: row }) };
  } catch (e: any) {
    // Pass through OpenAI 403/permissions clearly
    const msg = e?.response?.data?.error?.message || e?.message || "Unknown error";
    const code = e?.status || e?.response?.status || 500;
    return { statusCode: code, body: JSON.stringify({ error: msg }) };
  }
};
