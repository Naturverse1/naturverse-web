import type { Handler } from "@netlify/functions";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export const handler: Handler = async (event) => {
  try {
    if (!event.body) return { statusCode: 400, body: "Missing body" };
    const { userId, name, prompt } = JSON.parse(event.body);

    // Generate image
    const img = await openai.images.generate({
      model: "gpt-image-1",
      prompt,
      size: "1024x1024"
    });

    const b64 = img.data[0].b64_json;
    if (!b64) return { statusCode: 500, body: "No image returned" };

    const bytes = Buffer.from(b64, "base64");
    const fileName = `ai/${userId}/${Date.now()}.png`;

    // Upload to Supabase storage
    const { error: upErr } = await supabase.storage.from("navatars").upload(fileName, bytes, {
      contentType: "image/png",
      upsert: true
    });
    if (upErr) return { statusCode: 500, body: `Upload error: ${upErr.message}` };

    const { data: pub } = supabase.storage.from("navatars").getPublicUrl(fileName);
    const image_url = pub?.publicUrl;

    // Insert avatar row
    const { error: dbErr } = await supabase.from("avatars").insert({
      user_id: userId,
      name: name || "avatar",
      method: "ai",
      image_url,
      storage_path: fileName
    });
    if (dbErr) return { statusCode: 500, body: `DB error: ${dbErr.message}` };

    return { statusCode: 200, body: JSON.stringify({ image_url }) };
  } catch (e: any) {
    // OpenAI org not verified, propagate 403 clearly
    if (e?.status === 403) {
      return { statusCode: 403, body: "OPENAI_IMAGE_ACCESS_FORBIDDEN" };
    }
    return { statusCode: 500, body: e?.message || "Unknown error" };
  }
};
