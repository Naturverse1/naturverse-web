import type { Handler } from "@netlify/functions";

const handler: Handler = async (event) => {
  try {
    const SPACE = process.env.HUGGINGFACE_SPACE_URL;
    if (!SPACE) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "HUGGINGFACE_SPACE_URL not set" }),
      };
    }

    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method Not Allowed" };
    }

    const {
      prompt,
      negativePrompt = "",
      seed = 0,
      width = 512,
      height = 512,
      steps = 4,
    } = JSON.parse(event.body || "{}");

    const payload = {
      data: [
        prompt || "",
        negativePrompt,
        Number(seed) || 0,
        0,
        Number(width),
        Number(height),
        0,
        Number(steps),
      ],
    };

    const res = await fetch(`${SPACE}/gradio_api/call/infer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const txt = await res.text();

    if (!res.ok) {
      return {
        statusCode: res.status,
        body: JSON.stringify({ error: "Space start failed", raw: txt }),
      };
    }

    const match = txt.match(/[0-9a-f]{8}-[0-9a-f-]{27,}/i) || txt.match(/"(\w{8,})"/);
    if (!match) {
      return { statusCode: 502, body: JSON.stringify({ error: "No event id from Space", raw: txt }) };
    }

    const eventId = (match[1] ?? match[0]).replace(/(^"|"$)/g, "");
    return {
      statusCode: 200,
      headers: { "Cache-Control": "no-store" },
      body: JSON.stringify({ event_id: eventId }),
    };
  } catch (e: any) {
    return { statusCode: 500, body: JSON.stringify({ error: e?.message || "start failed" }) };
  }
};

export { handler };
