import type { Handler } from "@netlify/functions";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;
const IMAGES_BUCKET = process.env.IMAGES_BUCKET || "avatars";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// add a longer client-side timeout so OpenAI calls don’t hang forever
const openai = new OpenAI({ apiKey: OPENAI_API_KEY, timeout: 25000 });

async function withRetry<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (e) {
    // quick single retry for transient timeouts
    await new Promise((r) => setTimeout(r, 800));
    return await fn();
  }
}

const json = (code: number, body: unknown) => ({
  statusCode: code,
  headers: {
    "content-type": "application/json",
    "access-control-allow-origin": "*",
  },
  body: typeof body === "string" ? body : JSON.stringify(body),
});

type Payload = {
  prompt?: string;
  userId?: string;
  name?: string;
  size?: "1024x1024" | "1024x1536" | "1536x1024" | "auto";
  sourceImageUrl?: string;
  maskImageUrl?: string;
};

const asBuf = async (url: string) => {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`Fetch failed: ${r.status} ${r.statusText}`);
  return Buffer.from(await r.arrayBuffer());
};

export const handler: Handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") return json(405, { error: "Method not allowed" });
    const body = (event.body ?? "").trim();
    if (!body) return json(400, { error: "Missing JSON body" });

    const { prompt, userId, name, size: rawSize, sourceImageUrl, maskImageUrl } =
      JSON.parse(body) as Payload;

    if (!prompt && !sourceImageUrl) return json(400, { error: "Provide prompt or sourceImageUrl" });

    const allowed = new Set(["1024x1024", "1024x1536", "1536x1024", "auto"]);
    const size = allowed.has(rawSize || "") ? rawSize : "1024x1024";

    // ---- OpenAI call with one retry ----
    let b64: string | undefined;

    if (sourceImageUrl) {
      const image = await asBuf(sourceImageUrl);
      const mask = maskImageUrl ? await asBuf(maskImageUrl) : undefined;

      const edit = await withRetry(() =>
        openai.images.edits({
          model: "gpt-image-1",
          prompt: prompt ?? "",
          image,
          ...(mask ? { mask } : {}),
          size,
        })
      );
      b64 = (edit as any)?.data?.[0]?.b64_json;
    } else {
      const gen = await withRetry(() =>
        openai.images.generate({ model: "gpt-image-1", prompt: prompt ?? "", size })
      );
      b64 = (gen as any)?.data?.[0]?.b64_json;
    }

    if (!b64) return json(502, { error: "No image data returned from OpenAI" });

    const buffer = Buffer.from(b64, "base64");
    const path = `ai/${userId || "anon"}/${Date.now()}.png`;

    const { error: upErr } = await supabase.storage
      .from(IMAGES_BUCKET)
      .upload(path, buffer, {
        contentType: "image/png",
        cacheControl: "public, max-age=31536000",
        upsert: true,
      });
    if (upErr) return json(500, { error: `Upload failed: ${upErr.message}` });

    const { data: pub } = supabase.storage.from(IMAGES_BUCKET).getPublicUrl(path);
    const image_url = pub?.publicUrl;
    if (!image_url) return json(500, { error: "Could not resolve public URL" });

    const display = name?.trim() || "Navatar";
    const { error: dbErr } = await supabase
      .from("avatars")
      .upsert(
        { user_id: userId ?? null, name: display, category: "generate", method: "generate", image_url },
        { onConflict: "user_id" }
      );
    if (dbErr) return json(500, { error: `DB upsert failed: ${dbErr.message}` });

    return json(200, { image_url });
  } catch (e: any) {
    const msg = e?.message || e?.response?.data?.error?.message || "Server error";
    return json(504, { error: msg }); // surface real reason to the UI
  }
};
