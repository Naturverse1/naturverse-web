import type { Handler } from "@netlify/functions";

const SPACE = process.env.HUGGINGFACE_SPACE_URL;
const FN = "infer";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function poll(url: string, tries = 30) {
  for (let i = 0; i < tries; i += 1) {
    const response = await fetch(url, { method: "GET" });
    if (!response.ok) {
      throw new Error(`Polling failed: ${response.status} ${response.statusText}`);
    }

    const json = await response.json().catch(() => null);

    if (!json || typeof json !== "object") {
      throw new Error("Space returned an invalid polling response");
    }

    if (json?.status === "FAILED") {
      const detail =
        typeof json?.detail === "string"
          ? json.detail
          : typeof json?.error === "string"
          ? json.error
          : undefined;
      throw new Error(detail || "Space reported a failure while generating.");
    }

    if (json?.status === "COMPLETE" || Array.isArray(json?.data)) {
      return json;
    }

    await sleep(1000);
  }

  throw new Error("Space timed out while generating.");
}

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

export const handler: Handler = async (event) => {
  try {
    if (!SPACE) {
      throw new Error("HUGGINGFACE_SPACE_URL not set");
    }

    if (event.httpMethod !== "POST") {
      return jsonResponse(405, { error: "Method Not Allowed" });
    }

    let payload: any = {};
    try {
      payload = JSON.parse(event.body || "{}");
    } catch (error) {
      return jsonResponse(400, { error: "Invalid JSON payload" });
    }

    const rawPrompt = typeof payload?.prompt === "string" ? payload.prompt : "";
    const prompt = rawPrompt.trim();
    const negative =
      typeof payload?.negative === "string" ? payload.negative.trim() : "";
    const width =
      typeof payload?.width === "number" && Number.isFinite(payload.width)
        ? Math.max(64, Math.floor(payload.width))
        : 1024;
    const height =
      typeof payload?.height === "number" && Number.isFinite(payload.height)
        ? Math.max(64, Math.floor(payload.height))
        : 1024;

    if (!prompt) {
      return jsonResponse(400, { error: "Missing prompt" });
    }

    const data = [
      prompt,
      negative,
      0,
      7.5,
      28,
      "Euler a",
      width,
      height,
    ];

    const start = await fetch(`${SPACE}/gradio_api/call/${FN}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data }),
    });

    if (!start.ok) {
      const raw = await start.text().catch(() => "");
      throw new Error(
        `Space call failed: ${start.status} ${start.statusText}${raw ? ` – ${raw}` : ""}`
      );
    }

    const startJson = await start.json().catch(() => null);
    const eventId = startJson?.event_id;

    if (!eventId || typeof eventId !== "string") {
      throw new Error("Space did not return an event_id");
    }

    const result = await poll(`${SPACE}/gradio_api/call/${FN}/${eventId}`);

    const base64 = Array.isArray(result?.data) ? result.data[0] : null;
    if (typeof base64 !== "string" || !base64) {
      throw new Error("Space returned no image data");
    }

    return jsonResponse(200, { imageBase64: base64 });
  } catch (error: any) {
    const message = typeof error?.message === "string" ? error.message : "Unknown error";
    return jsonResponse(500, { error: message });
  }
};
