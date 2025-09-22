import type { Handler } from "@netlify/functions";

const getSpaceBase = () => {
  const raw =
    process.env.HF_SPACE_URL ||
    process.env.HUGGINGFACE_SPACE_URL ||
    "";
  return raw.replace(/\/+$/, "");
};

const json = (statusCode: number, data: unknown) => ({
  statusCode,
  headers: {
    "Content-Type": "application/json",
    "Cache-Control": "no-store",
  },
  body: JSON.stringify(data),
});

export const handler: Handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return json(405, { error: "Method Not Allowed" });
    }
    const SPACE = getSpaceBase();
    if (!SPACE) {
      return json(500, { error: "HF_SPACE_URL not set" });
    }

    const { prompt, negativePrompt = "", seed = 0, width = 1024, height = 1024, guidance = 0, steps = 1 } =
      JSON.parse(event.body || "{}");

    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return json(400, { error: "Missing prompt" });
    }

    await fetch(`${SPACE}/`, { method: "GET" }).catch(() => {});

    const post = await fetch(`${SPACE}/gradio_api/call/infer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        data: [prompt, negativePrompt, seed, true, width, height, guidance, steps],
      }),
    });
    if (!post.ok) {
      const txt = await post.text().catch(() => "");
      return json(502, {
        error: `Space call failed: ${post.status} ${post.statusText}`,
        details: txt,
      });
    }
    const { event_id } = await post.json();
    return json(200, { eventId: event_id });
  } catch (err: any) {
    return json(500, { error: err?.message || "Unknown error" });
  }
};
