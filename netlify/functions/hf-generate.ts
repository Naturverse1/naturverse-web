import type { Handler } from "@netlify/functions";

export const handler: Handler = async (event) => {
  try {
    if (event.httpMethod === "OPTIONS") {
      return { statusCode: 204, headers: cors() } as const;
    }
    if (event.httpMethod !== "POST") {
      return json(405, { error: "Use POST" });
    }

    const { prompt } = JSON.parse(event.body || "{}");
    if (!prompt) return json(400, { error: "Missing prompt" });

    const model = process.env.HF_MODEL_ID || "black-forest-labs/FLUX.1-dev";
    const token = process.env.HF_API_TOKEN;
    if (!token) return json(500, { error: "HF_API_TOKEN not set" });

    // Call Hugging Face Inference API
    const response = await fetch(
      `https://api-inference.huggingface.co/models/${model}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: prompt,
          options: { wait_for_model: true },
        }),
      }
    );

    if (!response.ok) {
      const txt = await response.text();
      return json(response.status, { error: "HF API failed", detail: txt });
    }

    // HF returns raw binary (image) for text-to-image models
    const arrayBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    const dataUrl = `data:image/png;base64,${base64}`;

    return json(200, { image: dataUrl });
  } catch (err: any) {
    return json(500, { error: err?.message || String(err) });
  }
};

function json(status: number, obj: any) {
  return {
    statusCode: status,
    headers: { "Content-Type": "application/json", ...cors() },
    body: JSON.stringify(obj),
  };
}
function cors() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  };
}
