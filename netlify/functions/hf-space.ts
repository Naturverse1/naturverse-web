import type { Handler } from "@netlify/functions";
import { hfFetch } from "./_hf";

type GenerationInput = {
  prompt?: unknown;
  negative_prompt?: unknown;
  seed?: unknown;
  randomize_seed?: unknown;
  width?: unknown;
  height?: unknown;
  guidance_scale?: unknown;
  num_inference_steps?: unknown;
};

export const handler: Handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return jsonResponse(405, { error: "Method Not Allowed" });
    }

    let input: GenerationInput = {};
    if (event.body) {
      try {
        input = JSON.parse(event.body);
      } catch {
        return jsonResponse(400, { error: "Invalid JSON" });
      }
    }

    const payload = {
      data: [
        typeof input.prompt === "string" ? input.prompt : "",
        typeof input.negative_prompt === "string" ? input.negative_prompt : "",
        toNumber(input.seed, 0),
        Boolean(input.randomize_seed ?? true),
        toNumber(input.width, 1024),
        toNumber(input.height, 1024),
        toNumber(input.guidance_scale, 0),
        toNumber(input.num_inference_steps, 2),
      ],
    };

    const response = await hfFetch("/gradio_api/call/infer", {
      method: "POST",
      body: JSON.stringify(payload),
      retries: 1,
    });

    const json = await response.json();
    return jsonResponse(200, json);
  } catch (error: any) {
    return jsonResponse(500, { error: String(error?.message || error) });
  }
};

function jsonResponse(statusCode: number, body: unknown) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
    body: JSON.stringify(body),
  };
}

function toNumber(value: unknown, fallback: number) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }
  return fallback;
}
