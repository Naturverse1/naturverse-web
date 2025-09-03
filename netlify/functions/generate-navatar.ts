import type { Handler } from "@netlify/functions";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;
const BUCKET = process.env.IMAGES_BUCKET || "avatars";

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// util: read a remote file as Buffer (unused now, but handy if you later support URL inputs)
async function fetchAsBuffer(url: string) {
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

    // Accept both JSON and multipart/form-data
    const ctype = event.headers["content-type"] || event.headers["Content-Type"] || "";
    let prompt = "";
    let name: string | undefined;
    let user_id: string | undefined;
    let sourceFile: Buffer | undefined;
    let maskFile: Buffer | undefined;

    if (ctype.includes("application/json")) {
      const body = JSON.parse(event.body || "{}");
      prompt = (body.prompt || "").toString();
      name = body.name ? String(body.name) : undefined;
      user_id = body.userId || body.user_id ? String(body.userId || body.user_id) : undefined;
      // (optional) support URLs later if you want: sourceImageUrl, maskImageUrl
    } else if (ctype.startsWith("multipart/form-data")) {
      // Netlify doesn’t parse multipart; use a tiny parser
      const boundary = /boundary=([^;]+)/i.exec(ctype)?.[1];
      if (!boundary) throw new Error("Bad multipart request");
      const delimiter = `--${boundary}`;

      const raw = Buffer.from(event.body || "", "base64"); // Functions send body base64-encoded
      const parts = raw.toString("binary").split(delimiter).slice(1, -1);

      for (const part of parts) {
        const [rawHeaders, ...rest] = part.split("\r\n\r\n");
        const value = rest.join("\r\n\r\n").replace(/\r\n$/, "");
        const headerName = /name="([^"]+)"/.exec(rawHeaders)?.[1];
        const filename = /filename="([^"]+)"/.exec(rawHeaders)?.[1];

        if (!headerName) continue;

        if (filename) {
          const bin = Buffer.from(value, "binary");
          if (headerName === "source") sourceFile = bin;
          if (headerName === "mask") maskFile = bin;
        } else {
          const text = value;
          if (headerName === "prompt") prompt = text;
          if (headerName === "name") name = text;
          if (headerName === "userId" || headerName === "user_id") user_id = text;
        }
      }
    } else {
      return { statusCode: 400, body: JSON.stringify({ error: "Unsupported content-type" }) };
    }

    if (!prompt && !sourceFile) {
      return { statusCode: 400, body: JSON.stringify({ error: "Provide a prompt or a source image" }) };
    }

    // --- 1) Generate / Edit via OpenAI ---
    // Keep under Netlify free timeout: use 512; bump to 1024 later if you upgrade
    const SIZE = (process.env.NAVATAR_SIZE || "512x512") as "512x512" | "1024x1024";

    let b64: string | undefined;

    if (sourceFile) {
      // Image edit with optional mask
      const edit = await openai.images.edits({
        model: "gpt-image-1",
        prompt: prompt || "edit image",
        image: sourceFile, // Buffer is fine in the 4.x SDK
        ...(maskFile ? { mask: maskFile } : {}),
        size: SIZE
        // NO response_format here
      });
      b64 = edit.data?.[0]?.b64_json;
    } else {
      // Pure generation
      const gen = await openai.images.generate({
        model: "gpt-image-1",
        prompt,
        size: SIZE
        // NO response_format here
      });
      b64 = gen.data?.[0]?.b64_json;
    }

    if (!b64) {
      return { statusCode: 502, body: JSON.stringify({ error: "Image generation returned no data" }) };
    }

    const buffer = Buffer.from(b64, "base64");

    // --- 2) Upload to Supabase Storage ---
    const filename = `ai/${user_id ?? "anon"}/${Date.now()}.png`;
    const { error: upErr } = await supabase.storage.from(BUCKET).upload(filename, buffer, {
      contentType: "image/png",
      upsert: true,
      cacheControl: "public, max-age=31536000"
    });
    if (upErr) {
      return { statusCode: 500, body: JSON.stringify({ error: `Upload failed: ${upErr.message}` }) };
    }

    const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(filename);
    const image_url = pub.publicUrl;
    if (!image_url) {
      return { statusCode: 500, body: JSON.stringify({ error: "Could not resolve public URL" }) };
    }

    // --- 3) Insert DB row ---
    const { error: insErr } = await supabase
      .from("avatars")
      .insert({
        user_id: user_id ?? null,
        name: name || "AI avatar",
        method: "ai", // allowed by your updated check constraint
        image_url
      })
      .select("*")
      .single();

    if (insErr) {
      return { statusCode: 500, body: JSON.stringify({ error: `DB insert failed: ${insErr.message}` }) };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ image_url })
    };
  } catch (e: any) {
    // bubble OpenAI errors clearly
    const msg =
      e?.response?.data?.error?.message ||
      e?.message ||
      "Unknown server error";
    const code = e?.status || e?.response?.status || 500;
    return { statusCode: code, body: JSON.stringify({ error: msg }) };
  }
};

