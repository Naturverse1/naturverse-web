import type { Handler } from "@netlify/functions";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
  project: process.env.OPENAI_PROJECT,
});

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  try {
    const { userId, name, prompt } = JSON.parse(event.body || "{}") as {
      userId?: string;
      name?: string;
      prompt?: string;
    };

    if (!userId || !prompt) {
      return json({ error: "userId and prompt are required" }, 400);
    }

    const img = await openai.images.generate({
      model: "gpt-image-1",
      prompt,
      size: "1024x1024",
    });

    const b64 = img.data?.[0]?.b64_json;
    if (!b64) return json({ error: "No image returned" }, 502);

    const bytes = Buffer.from(b64, "base64");
    const id = crypto.randomUUID();
    const filePath = `${userId}/${id}.png`;

    const { error: upErr } = await supabase.storage
      .from("avatars")
      .upload(filePath, bytes, {
        contentType: "image/png",
        upsert: false,
      });
    if (upErr) return json({ error: `Upload failed: ${upErr.message}` }, 500);

    const { data: pub } = supabase.storage.from("avatars").getPublicUrl(filePath);
    const image_url = pub?.publicUrl;

    const { error: dbErr } = await supabase.from("avatars").insert({
      id,
      user_id: userId,
      name: name || "AI Avatar",
      method: "ai",
      image_url,
    });
    if (dbErr) return json({ error: `DB insert failed: ${dbErr.message}` }, 500);

    return json({ id, name: name || "AI Avatar", image_url, method: "ai" });
  } catch (e: any) {
    return json({ error: e?.message || "Unknown error" }, 500);
  }
};

function json(body: any, status = 200) {
  return {
    statusCode: status,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
}
