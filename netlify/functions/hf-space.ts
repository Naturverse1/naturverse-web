import type { Handler } from "@netlify/functions";
import { getSpaceBaseUrl, getBearer, retryingFetch } from "../../src/lib/_hf";

type Payload = {
  prompt: string;
  negativePrompt?: string;
  seed?: number | null;
  width?: number;
  height?: number;
  guidanceScale?: number;
  steps?: number;
};

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const base = getSpaceBaseUrl();
  if (!base) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "HF_SPACE_URL not set" })
    };
  }

  let body: Payload;
  try {
    body = JSON.parse(event.body || "{}");
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: "Bad JSON" }) };
  }

  const {
    prompt,
    negativePrompt = "",
    seed = 0,
    width = 1024,
    height = 1024,
    guidanceScale = 0,
    steps = 2,
  } = body;

  if (!prompt || typeof prompt !== "string") {
    return { statusCode: 400, body: JSON.stringify({ error: "Missing prompt" }) };
  }

  const apiUrl = `${base}/gradio_api/call/infer`;
  const token = getBearer();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  // Gradio template params order (8):
  // [ prompt, negative_prompt, seed, randomize_seed, width, height, guidance_scale, num_inference_steps ]
  const data = [
    prompt,
    negativePrompt,
    Number(seed) || 0,
    seed === null || seed === undefined ? true : false, // randomize if no seed
    Number(width) || 1024,
    Number(height) || 1024,
    Number(guidanceScale) || 0,
    Number(steps) || 2,
  ];

  try {
    const res = await retryingFetch(apiUrl, {
      method: "POST",
      headers,
      body: JSON.stringify({ data }),
      // keep requests snappy; we only need the event_id back
      redirect: "follow",
    });

    const json = await res.json();

    // Gradio returns an object with "event_id"
    const eventId = json?.event_id || json?.eventId || json?.event?.id;
    if (!eventId) {
      return {
        statusCode: 502,
        body: JSON.stringify({ error: "No event_id from Space", raw: json }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        ok: true,
        eventId,
      }),
    };
  } catch (err: any) {
    return {
      statusCode: 502,
      body: JSON.stringify({ error: "Submit to Space failed", detail: String(err) }),
    };
  }
};
