import type { Handler } from "@netlify/functions";
import { getSpaceBaseUrl, parseGradioResult } from "../../src/utils/_hf";

export const handler: Handler = async (event) => {
  try {
    const eventId = event.queryStringParameters?.eventId || "";
    if (!eventId) return { statusCode: 400, body: "Missing eventId" };

    const spaceBase = getSpaceBaseUrl();

    const resp = await fetch(`${spaceBase}/gradio_api/call/infer/${encodeURIComponent(eventId)}`, {
      method: "GET",
      headers: { Accept: "text/event-stream,application/json" },
    });

    if (!resp.ok) {
      return { statusCode: 200, body: JSON.stringify({ status: "pending" }) };
    }

    const parsed = await parseGradioResult(resp, spaceBase);
    if (!parsed) return { statusCode: 200, body: JSON.stringify({ status: "pending" }) };

    return {
      statusCode: 200,
      body: JSON.stringify({ status: "succeeded", imageUrl: parsed.imageUrl, seed: parsed.seed }),
    };
  } catch {
    return { statusCode: 200, body: JSON.stringify({ status: "pending" }) };
  }
};
