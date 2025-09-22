import type { Handler } from "@netlify/functions";

type InferResp =
  | { event_id: string }
  | { data: unknown[] }
  | { detail?: unknown }
  | Record<string, unknown>;

const spaceBase = process.env.HUGGINGFACE_SPACE_URL;

if (!spaceBase) {
  console.warn("HUGGINGFACE_SPACE_URL not set");
}

function json(statusCode: number, body: unknown) {
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
  if (event.httpMethod !== "POST") {
    return json(405, { errors: ["Method Not Allowed"] });
  }

  if (!spaceBase) {
    return json(500, { errors: ["HUGGINGFACE_SPACE_URL not set"] });
  }

  try {
    const parsed = JSON.parse(event.body || "{}") as Record<string, unknown>;

    const prompt = typeof parsed.prompt === "string" ? parsed.prompt : "";
    if (!prompt.trim()) {
      return json(400, { errors: ["Prompt required"] });
    }

    const negativePrompt =
      typeof parsed.negativePrompt === "string" ? parsed.negativePrompt : "";
    const seed = typeof parsed.seed === "number" ? parsed.seed : 0;
    const width = typeof parsed.width === "number" ? parsed.width : 1024;
    const height = typeof parsed.height === "number" ? parsed.height : 1024;
    const guidance =
      typeof parsed.guidance === "number" ? parsed.guidance : 0;
    const steps = typeof parsed.steps === "number" ? parsed.steps : 1;

    const postRes = await fetch(`${spaceBase}/gradio_api/call/infer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        data: [
          prompt,
          negativePrompt,
          seed,
          true,
          width,
          height,
          guidance,
          steps,
        ],
      }),
    });

    if (!postRes.ok) {
      const text = await postRes.text();
      return json(postRes.status, {
        errors: ["Space POST failed"],
        detail: text,
      });
    }

    const postJson: InferResp = await postRes.json();
    const eventId =
      typeof (postJson as { event_id?: unknown }).event_id === "string"
        ? (postJson as { event_id: string }).event_id
        : null;

    if (!eventId) {
      return json(502, {
        errors: ["Space did not return event_id"],
        detail: postJson,
      });
    }

    const getRes = await fetch(`${spaceBase}/gradio_api/call/infer/${eventId}`);
    if (!getRes.ok) {
      const text = await getRes.text();
      return json(getRes.status, {
        errors: ["Space GET failed"],
        detail: text,
      });
    }

    const getJson: InferResp = await getRes.json();

    const data = (getJson as { data?: unknown }).data;
    const image = Array.isArray(data)
      ? (data as unknown[]).find(
          (item) => typeof item === "string" && item.startsWith("data:image/")
        )
      : undefined;

    return json(200, { image, raw: getJson });
  } catch (err: unknown) {
    const message =
      typeof err === "object" && err && "message" in err
        ? String((err as { message?: unknown }).message)
        : String(err);
    return json(500, {
      errors: ["Unhandled error"],
      detail: message,
    });
  }
};

export default handler;
