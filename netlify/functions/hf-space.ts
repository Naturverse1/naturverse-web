import type { Handler } from "@netlify/functions";
import { getSpaceBaseUrl, getBearer, retryingFetch } from "../../src/lib/_hf";

const jsonHeaders = {
  "Content-Type": "application/json",
  "Cache-Control": "no-store",
};

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers: jsonHeaders, body: JSON.stringify({ error: "Method Not Allowed" }) };
  }

  const base = getSpaceBaseUrl();
  if (!base) {
    return { statusCode: 500, headers: jsonHeaders, body: JSON.stringify({ error: "HF_SPACE_URL not set" }) };
  }

  const bearer = getBearer();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  if (bearer) {
    headers.Authorization = bearer;
  }

  const body = event.body ? JSON.parse(event.body) : {};
  const url = `${base}/gradio_api/call/infer`;

  try {
    const res = await retryingFetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify({
        data: [
          body.prompt ?? "",
          body.negative_prompt ?? "",
          body.seed ?? 0,
          body.randomize_seed ?? true,
          body.width ?? 1024,
          body.height ?? 1024,
          body.guidance_scale ?? 0,
          body.num_inference_steps ?? 2,
        ],
      }),
    });

    const json = await res.json().catch(() => ({}));
    const eventId: string | undefined = json?.event_id || json?.eventId || json?.id;

    if (!eventId) {
      return { statusCode: 502, headers: jsonHeaders, body: JSON.stringify({ error: "No eventId from Space" }) };
    }

    return { statusCode: 200, headers: jsonHeaders, body: JSON.stringify({ ok: true, eventId }) };
  } catch (err: any) {
    const message = err?.message ? String(err.message) : String(err);
    return { statusCode: 502, headers: jsonHeaders, body: JSON.stringify({ error: message }) };
  }
};
