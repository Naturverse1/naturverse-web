import type { Handler } from "@netlify/functions";
import { randomBytes } from "node:crypto";

const STABILITY_KEY = process.env.STABILITY_API_KEY;
const DICEBEAR_STYLE = process.env.DICEBEAR_STYLE ?? "adventurer";
const DICEBEAR_FORMAT = process.env.DICEBEAR_FORMAT ?? "png";
const IMG_SIZE = Number.parseInt(process.env.AVATAR_SIZE ?? "1024", 10) || 1024;

type JsonBody = { statusCode: number; headers: Record<string, string>; body: string };

const json = (status: number, body: unknown): JsonBody => ({
  statusCode: status,
  headers: { "content-type": "application/json" },
  body: JSON.stringify(body),
});

interface GeneratePayload {
  prompt?: string;
  negativePrompt?: string;
  seed?: string | number;
}

export const handler: Handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return json(405, { error: "method_not_allowed" });
    }

    let payload: GeneratePayload;
    try {
      payload = JSON.parse(event.body ?? "{}") as GeneratePayload;
    } catch {
      return json(400, { error: "invalid_json" });
    }

    const prompt = typeof payload.prompt === "string" ? payload.prompt.trim() : "";
    const negativePrompt =
      typeof payload.negativePrompt === "string" ? payload.negativePrompt.trim() : "";
    const seed =
      payload.seed !== undefined && payload.seed !== null && `${payload.seed}`.trim() !== ""
        ? `${payload.seed}`
        : undefined;

    if (STABILITY_KEY && prompt) {
      try {
        const form = new FormData();
        form.set("prompt", prompt);
        form.set("output_format", "webp");
        form.set("aspect_ratio", "1:1");
        form.set("mode", "text-to-image");
        form.set("width", String(IMG_SIZE));
        form.set("height", String(IMG_SIZE));
        if (negativePrompt) {
          form.set("negative_prompt", negativePrompt);
        }
        if (seed) {
          form.set("seed", seed);
        }

        const response = await fetch("https://api.stability.ai/v2beta/stable-image/generate/core", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${STABILITY_KEY}`,
            Accept: "application/json",
          },
          body: form,
        });

        if (response.ok) {
          const output = (await response.json()) as any;
          const imageBase64: string | undefined =
            typeof output?.image === "string"
              ? output.image
              : Array.isArray(output?.images) && typeof output.images[0]?.image === "string"
              ? output.images[0]?.image
              : undefined;

          if (imageBase64) {
            return json(200, {
              source: "stability",
              mime: "image/webp",
              imageBase64,
            });
          }
        } else if (response.status !== 400 && response.status !== 401) {
          // Allow fallback for credits, rate limits, and server errors.
        } else {
          // client error — fall through to fallback avatar
        }
      } catch (err) {
        console.error("stability_generate_error", err);
      }
    }

    const seedValue = seed ?? randomHex();
    const dicebearUrl =
      `https://api.dicebear.com/9.x/${encodeURIComponent(DICEBEAR_STYLE)}/${DICEBEAR_FORMAT}` +
      `?seed=${encodeURIComponent(seedValue)}` +
      `&size=${IMG_SIZE}&radius=0&backgroundType=none`;

    const dicebearResponse = await fetch(dicebearUrl);
    if (!dicebearResponse.ok) {
      return json(502, { error: "dicebear_failed" });
    }

    const buffer = Buffer.from(await dicebearResponse.arrayBuffer());
    const mime =
      DICEBEAR_FORMAT === "svg"
        ? "image/svg+xml"
        : DICEBEAR_FORMAT === "webp"
        ? "image/webp"
        : "image/png";

    return json(200, {
      source: "dicebear",
      mime,
      imageBase64: buffer.toString("base64"),
    });
  } catch (error: any) {
    console.error("generate_avatar_error", error);
    return json(500, { error: "server_error", message: error?.message ?? "unknown" });
  }
};

function randomHex(): string {
  return randomBytes(16).toString("hex");
}
