import type { Handler } from "@netlify/functions";
import { extractImageUrl, getBearerToken, getSpaceConfig, jsonResponse } from "./_hf";

const SOFT_BUDGET_MS = 2200;

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "GET") {
    return jsonResponse(405, { ok: false, error: "Method Not Allowed" });
  }

  const config = getSpaceConfig();
  if (!config) {
    return pending();
  }

  const eventId = event.queryStringParameters?.eventId?.trim();
  if (!eventId) {
    return pending();
  }

  const bearer = getBearerToken();
  const headers: Record<string, string> = { Accept: "application/json" };
  if (bearer) {
    headers.Authorization = `Bearer ${bearer}`;
  }

  const start = Date.now();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), Math.max(0, SOFT_BUDGET_MS - 200));

  try {
    const response = await fetch(
      `${config.hfBase}/gradio_api/call/infer/${encodeURIComponent(eventId)}?t=${Date.now()}`,
      {
        method: "GET",
        headers,
        signal: controller.signal,
      }
    );

    if (Date.now() - start > SOFT_BUDGET_MS) {
      return pending();
    }

    if (response.status === 202 || response.status === 204) {
      return pending();
    }

    const text = await response.text();
    if (!text || Date.now() - start > SOFT_BUDGET_MS) {
      return pending();
    }

    let payload: any = null;
    try {
      payload = JSON.parse(text);
    } catch {
      payload = null;
    }

    if (!payload) {
      return pending();
    }

    const statusValue = typeof payload.status === "string" ? payload.status.toLowerCase() : undefined;
    if (statusValue) {
      if (statusValue === "pending" || statusValue === "processing" || statusValue === "queued") {
        return pending();
      }
      if (statusValue.includes("error")) {
        return pending();
      }
    }

    const imageUrl = extractImageUrl(payload, config);
    if (!imageUrl) {
      return pending();
    }

    return jsonResponse(200, { ok: true, status: "done", imageUrl });
  } catch {
    return pending();
  } finally {
    clearTimeout(timer);
  }
};

function pending() {
  return jsonResponse(200, { ok: true, status: "pending" });
}
