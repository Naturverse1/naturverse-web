import type { Handler } from "@netlify/functions";
import { generateImage } from "./hfClient";

const SPACE = process.env.HF_SPACE_URL;

export const handler: Handler = async (event) => {
  try {
    if (!SPACE) {
      return resp(500, { errors: ["HF_SPACE_URL not set"] });
    }
    if (event.httpMethod !== "POST") {
      return resp(405, { errors: ["Method not allowed"] });
    }

    const { prompt } = JSON.parse(event.body || "{}");
    if (!prompt || typeof prompt !== "string") {
      return resp(400, { errors: ["Missing prompt"] });
    }

    const data: any = await generateImage(prompt);

    if (data && typeof data === "object" && "raw" in data) {
      return resp(502, { errors: ["Unexpected Space response"], raw: data.raw });
    }

    let imageDataUrl: string | null = null;

    if (Array.isArray(data?.data)) {
      const first = data.data[0];
      if (typeof first === "string" && first.startsWith("data:image/")) {
        imageDataUrl = first;
      } else if (first && typeof first === "object" && typeof first.name === "string") {
        imageDataUrl = `${SPACE}/${first.name.replace(/^file=*/, "")}`;
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
