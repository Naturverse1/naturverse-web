import type { Handler } from "@netlify/functions";

const HF_API_KEY = process.env.HUGGINGFACE_API_KEY || process.env.HF_API_TOKEN;
const HF_MODEL_ID = process.env.HF_MODEL_ID || "black-forest-labs/FLUX.1-dev";
const HF_API = `https://api-inference.huggingface.co/models/${HF_MODEL_ID}`;

const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return res(405, { error: "Method not allowed" });
  }
  if (!HF_API_KEY) {
    return res(500, { error: "Missing HUGGINGFACE_API_KEY env var" });
  }

  try {
    const { prompt, width = 1024, height = 1024, seed } = JSON.parse(event.body || "{}");
    if (!prompt || typeof prompt !== "string") {
      return res(400, { error: "Missing prompt" });
    }

    const ac = new AbortController();
    const timeout = setTimeout(() => ac.abort(), 55_000);
    const response = await fetch(HF_API, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HF_API_KEY}`,
        Accept: "image/webp,image/png,image/jpeg,*/*",
        "Content-Type": "application/json",
        "x-wait-for-model": "true",
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          width,
          height,
          seed,
        },
      }),
      signal: ac.signal,
    }).catch((error) => {
      if (error && typeof error === "object" && (error as Error).name === "AbortError") {
        throw new Error("Hugging Face request timed out");
      }
      throw error;
    });
    clearTimeout(timeout);

    const contentType = response.headers.get("content-type") || "";
    if (!response.ok) {
      const message = contentType.includes("application/json")
        ? (await response.json()).error || response.statusText
        : response.statusText;
      return res(response.status, { error: `HF error: ${message}` });
    }

    const bytes = new Uint8Array(await response.arrayBuffer());
    const base64 = Buffer.from(bytes).toString("base64");
    const mime = contentType.split(";")[0] || "image/webp";
    const dataUrl = `data:${mime};base64,${base64}`;

    return res(200, { ok: true, mime, dataUrl });
  } catch (error: any) {
    return res(500, { error: error?.message || "Unknown server error" });
  }
};

function res(status: number, body: unknown) {
  return {
    statusCode: status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "no-store",
    },
    body: JSON.stringify(body),
  };
}

export { handler };
