import type { Handler } from "@netlify/functions";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;
const IMAGES_BUCKET = process.env.IMAGES_BUCKET || "avatars";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

// simple in-memory idempotency window (per function instance)
const recentKeys = new Map<string, number>();
const IDEMPOTENCY_WINDOW_MS = 20_000;

const json = (code: number, body: unknown) => ({
  statusCode: code,
  headers: {
    "content-type": "application/json",
    "access-control-allow-origin": "*",
  },
  body: typeof body === "string" ? body : JSON.stringify(body),
});

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

type Payload = {
  prompt?: string;
  userId?: string;
  name?: string;
  // keep server authoritative: we will force a safe size/quality
  size?: string;
  sourceImageUrl?: string;
  maskImageUrl?: string;
  // optional idempotency key from client; we also build one if missing
  idempotencyKey?: string;
};

export const handler: Handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return json(405, { error: "Method Not Allowed" });
    }
    if (!OPENAI_API_KEY) return json(500, { error: "Missing OPENAI_API_KEY" });

    const raw = (event.body ?? "").trim();
    if (!raw) return json(400, { error: "Missing JSON body" });

    const {
      prompt,
      userId,
      name,
      sourceImageUrl,
      maskImageUrl,
      idempotencyKey: clientKey,
    } = JSON.parse(raw) as Payload;

    // ---- quick input guards (cheap!)
    const p = (prompt ?? "").trim();
    if (!p && !sourceImageUrl) return json(400, { error: "Provide prompt or sourceImageUrl" });
    if (p.length > 500) return json(400, { error: "Prompt too long (max ~500 chars for dev)" });

    // prevent accidental double submits within a short window
    const key = clientKey || `${userId || "anon"}::${p}::${sourceImageUrl || ""}`;
    const now = Date.now();
    const last = recentKeys.get(key);
    if (last && now - last < IDEMPOTENCY_WINDOW_MS) {
      return json(429, { error: "Duplicate submit detected. Please wait a moment." });
    }
    recentKeys.set(key, now);

    // Garbage-collect old keys occasionally
    if (recentKeys.size > 100) {
      const cutoff = now - IDEMPOTENCY_WINDOW_MS;
      for (const [k, t] of recentKeys) if (t < cutoff) recentKeys.delete(k);
    }

    // ---- OpenAI call with a soft timeout (~45s) to avoid Netlify 504 + billing surprises
    const CONTEXT_TIMEOUT_MS = 45_000;

    // We keep cost stable: one image, standard quality, fixed size.
    const CALL = async () => {
      if (sourceImageUrl) {
        // fetch remote images right before the call (no re-fetch loops)
        const imgRes = await fetch(sourceImageUrl);
        if (!imgRes.ok) throw new Error(`Fetch source failed: ${imgRes.status}`);
        const image = Buffer.from(await imgRes.arrayBuffer());

        let mask: Buffer | undefined;
        if (maskImageUrl) {
          const maskRes = await fetch(maskImageUrl);
          if (!maskRes.ok) throw new Error(`Fetch mask failed: ${maskRes.status}`);
          mask = Buffer.from(await maskRes.arrayBuffer());
        }

        const edit = await openai.images.edits({
          model: "gpt-image-1",
          prompt: p || "",
          image,
          ...(mask ? { mask } : {}),
          size: "1024x1024",
          // safety: always 1 result, standard quality
          n: 1,
        });
        return edit.data?.[0]?.b64_json;
      } else {
        const gen = await openai.images.generate({
          model: "gpt-image-1",
          prompt: p || "",
          size: "1024x1024",
          n: 1,
        });
        return gen.data?.[0]?.b64_json;
      }
    };

    const b64 = await Promise.race([
      CALL(),
      (async () => {
        await sleep(CONTEXT_TIMEOUT_MS);
        throw new Error("Timeout while generating image");
      })(),
    ]);

    if (!b64) return json(502, { error: "No image data returned from OpenAI" });

    // ---- Upload to Supabase
    const buffer = Buffer.from(b64, "base64");
    const folder = `ai/${userId || "anon"}`;
    const filename = `${Date.now()}.png`;
    const path = `${folder}/${filename}`;

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

    // ---- DB upsert (method must be 'generate' to satisfy your CHECK)
    const display = (name || "Navatar").trim();
    const { error: dbErr } = await supabase
      .from("avatars")
      .upsert(
        {
          user_id: userId ?? null,
          name: display,
          category: "generate",
          method: "generate",
          image_url,
        },
        { onConflict: "user_id" }
      );
    if (dbErr) return json(500, { error: `DB upsert failed: ${dbErr.message}` });

    return json(200, { image_url });
  } catch (e: any) {
    // Map common OpenAI errors to clear messages
    const msg: string = e?.message || "";
    if (/Billing hard limit/i.test(msg)) {
      return json(402, {
        error:
          "OpenAI billing hard limit reached. Add credit or enable auto-recharge, then try again.",
      });
    }
    if (/Timeout while generating image/i.test(msg)) {
      return json(504, { error: "Image generation timed out. Please try again." });
    }
    // fall back
    return json(e?.status || 500, { error: msg || "Server error" });
  }
};
