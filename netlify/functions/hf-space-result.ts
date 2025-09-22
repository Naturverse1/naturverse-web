import type { Handler } from "@netlify/functions";
import { getSpaceBaseUrl, getBearer, retryingFetch, extractImageUrl } from "../../src/lib/_hf";

const jsonHeaders = {
  "Content-Type": "application/json",
  "Cache-Control": "no-store",
};

async function fetchWithSoftTimeout(url: string, headers: Record<string, string>, softMs = 7000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), softMs);
  try {
    const res = await retryingFetch(url, { headers, signal: controller.signal });
    clearTimeout(timer);
    return { ok: true as const, res };
  } catch (err) {
    clearTimeout(timer);
    return { ok: false as const, err };
  }
}

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "GET") {
    return { statusCode: 405, headers: jsonHeaders, body: JSON.stringify({ error: "Method Not Allowed" }) };
  }

  const base = getSpaceBaseUrl();
  if (!base) {
    return { statusCode: 500, headers: jsonHeaders, body: JSON.stringify({ error: "HF_SPACE_URL not set" }) };
  }

  const eventId = event.queryStringParameters?.eventId;
  if (!eventId) {
    return { statusCode: 400, headers: jsonHeaders, body: JSON.stringify({ error: "Missing eventId" }) };
  }

  const bearer = getBearer();
  const headers: Record<string, string> = { Accept: "application/json" };
  if (bearer) {
    headers.Authorization = bearer;
  }

  const url = `${base}/gradio_api/call/infer/${encodeURIComponent(eventId)}?t=${Date.now()}`;
  const result = await fetchWithSoftTimeout(url, headers, 7000);

  if (!result.ok) {
    return { statusCode: 200, headers: jsonHeaders, body: JSON.stringify({ ok: true, status: "pending" }) };
  }

  try {
    if (result.res.status === 202) {
      return { statusCode: 200, headers: jsonHeaders, body: JSON.stringify({ ok: true, status: "pending" }) };
    }

    const imageUrl = await extractImageUrl(result.res);
    if (!imageUrl) {
      return { statusCode: 200, headers: jsonHeaders, body: JSON.stringify({ ok: true, status: "pending" }) };
    }

    return {
      statusCode: 200,
      headers: jsonHeaders,
      body: JSON.stringify({ ok: true, status: "done", imageUrl }),
    };
  } catch {
    return { statusCode: 200, headers: jsonHeaders, body: JSON.stringify({ ok: true, status: "pending" }) };
  }
};
