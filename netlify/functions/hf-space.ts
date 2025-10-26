import type { Handler } from "@netlify/functions";
import { normalizeSpaceUrl } from "../../src/lib/normalizeUrl";

export const handler: Handler = async (event) => {
  try {
    const space = normalizeSpaceUrl(
      process.env.HUGGINGFACE_SPACE_URL || process.env.HF_SPACE_URL
    );
    if (!space) {
      return resp(500, { errors: ["HUGGINGFACE_SPACE_URL is not set"] });
    }
    if (event.httpMethod !== "POST") {
      return resp(405, { errors: ["Method not allowed"] });
    }

    const { prompt } = JSON.parse(event.body || "{}");
    if (!prompt || typeof prompt !== "string") {
      return resp(400, { errors: ["Missing prompt"] });
    }

    const gradio = await fetch(`${space}/api/predict/`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ data: [prompt] }),
    });

    if (!gradio.ok) {
      const raw = await gradio.text();
      return resp(gradio.status, { errors: ["Space request failed"], raw });
    }

    const data = await gradio.json();

    let imageDataUrl: string | null = null;

    if (Array.isArray(data?.data)) {
      const first = data.data[0];
      if (typeof first === "string" && first.startsWith("data:image/")) {
        imageDataUrl = first;
      } else if (first && typeof first === "object" && typeof first.name === "string") {
        imageDataUrl = `${space}/${first.name.replace(/^file=*/, "")}`;
      }
    }

    if (!imageDataUrl) {
      return resp(502, { errors: ["Unexpected Space response"], raw: data });
    }

    return resp(200, { imageDataUrl });
  } catch (err: any) {
    return resp(500, { errors: ["Unhandled error"], raw: String(err?.message || err) });
  }
};

function resp(status: number, body: unknown) {
  return {
    statusCode: status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
    body: JSON.stringify(body),
  };
}
