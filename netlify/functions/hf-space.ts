import type { Handler } from "@netlify/functions";

const SPACE = process.env.HUGGINGFACE_SPACE_URL ?? process.env.HF_SPACE_URL;

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return resp(405, { errors: ["Method not allowed"] });
  }

  if (!SPACE) {
    return resp(500, { errors: ["HUGGINGFACE_SPACE_URL not set"] });
  }

  try {
    const {
      prompt,
      negativePrompt = "",
      seed = 0,
      width = 1024,
      height = 1024,
      guidance = 0,
      steps = 1,
    } = JSON.parse(event.body || "{}");

    if (!prompt || typeof prompt !== "string") {
      return resp(400, { errors: ["Missing prompt"] });
    }

    const postRes = await fetch(`${SPACE}/gradio_api/call/infer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        data: [prompt, negativePrompt, seed, true, width, height, guidance, steps],
      }),
    });

    if (!postRes.ok) {
      const detail = await postRes.text();
      return resp(postRes.status, { errors: ["Space POST failed"], detail });
    }

    const json = await postRes.json();
    const eventId = json?.event_id;

    if (!eventId || typeof eventId !== "string") {
      return resp(502, { errors: ["Space did not return event_id"], detail: json });
    }

    return resp(200, { eventId });
  } catch (err: any) {
    return resp(500, { errors: ["Unhandled error"], detail: String(err?.message || err) });
  }
};

function resp(status: number, body: unknown) {
  return {
    statusCode: status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
    body: JSON.stringify(body),
  };
}

export default handler;
