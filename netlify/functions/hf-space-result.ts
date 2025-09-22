import type { Handler } from "@netlify/functions";
import { HF_SPACE_HOST, fetchWithRetry, safeText } from "../../src/lib/_hf";

const JSON_HEADERS = {
  "Content-Type": "application/json",
  "Cache-Control": "no-store",
};

export const handler: Handler = async (event) => {
  const eventId = event.queryStringParameters?.eventId;
  if (!eventId) {
    return { statusCode: 400, headers: JSON_HEADERS, body: JSON.stringify({ error: "Missing eventId" }) };
  }

  if (!HF_SPACE_HOST) {
    return { statusCode: 500, headers: JSON_HEADERS, body: JSON.stringify({ error: "HF_SPACE_URL not configured" }) };
  }

  try {
    const url = `${HF_SPACE_HOST}/gradio_api/call/infer/${eventId}`;
    const res = await fetchWithRetry(url, { method: "GET" }, 6, 800);

    if (!res.ok) {
      const body = await safeText(res);
      return {
        statusCode: res.status,
        headers: JSON_HEADERS,
        body: JSON.stringify({ error: "HF poll failed", detail: body }),
      };
    }

    const contentType = res.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      const body = await safeText(res);
      return {
        statusCode: 502,
        headers: JSON_HEADERS,
        body: JSON.stringify({
          error: "Unexpected poll response (not JSON)",
          detail: body.slice(0, 800),
        }),
      };
    }

    const json = await res.json();
    const status =
      json?.status || json?.data?.status || json?.state || json?.output?.status;
    const outputs =
      json?.data?.data || json?.output?.data || json?.result || json?.data;

    return { statusCode: 200, headers: JSON_HEADERS, body: JSON.stringify({ status, json, outputs }) };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return { statusCode: 500, headers: JSON_HEADERS, body: JSON.stringify({ error: message }) };
  }
};
