import type { Handler } from "@netlify/functions";

const HF_MODEL_ID = process.env.HF_MODEL_ID || "black-forest-labs/FLUX.1-dev";
const HF_API_KEY = process.env.HUGGINGFACE_API_KEY || "";

if (!HF_API_KEY) {
  // Fail fast at boot if key isn’t set
  console.warn("Missing HUGGINGFACE_API_KEY env var");
}

type HFError = { error?: string };

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function callHF(prompt: string, signal?: AbortSignal): Promise<Response> {
  return fetch(`https://api-inference.huggingface.co/models/${HF_MODEL_ID}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${HF_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      inputs: prompt,
      parameters: { size: "1024x1024" },
    }),
    signal,
  });
}

export const handler: Handler = async (event) => {
  if (event.httpMethod && event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  if (!HF_API_KEY) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Server missing HUGGINGFACE_API_KEY" }),
    };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(event.body || "{}");
  } catch {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Invalid JSON body" }),
    };
  }

  const payload = parsed as { prompt?: unknown };
  const promptText = typeof payload.prompt === "string" ? payload.prompt.trim() : "";

  if (!promptText) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Missing prompt" }),
    };
  }

  const controller = new AbortController();
  const deadline = Date.now() + 55_000;
  const timeoutId = setTimeout(() => controller.abort(), Math.max(deadline - Date.now(), 0));

  try {
    let resp = await callHF(promptText, controller.signal);
    let tries = 0;

    while (resp.status === 503 && Date.now() < deadline && tries < 6) {
      await wait(2_000);
      tries += 1;
      resp = await callHF(promptText, controller.signal);
    }

    if (!resp.ok) {
      let errBody: HFError | string;
      try {
        errBody = await resp.json();
      } catch {
        errBody = await resp.text();
      }

      return {
        statusCode: resp.status,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: `HF API failed (${resp.status})`, detail: errBody }),
      };
    }

    const buf = Buffer.from(await resp.arrayBuffer());
    const dataUrl = `data:image/png;base64,${buf.toString("base64")}`;

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: dataUrl }),
    };
  } catch (error: any) {
    if (error?.name === "AbortError") {
      return {
        statusCode: 504,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "HF API timed out" }),
      };
    }

    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: error?.message || "Unknown server error" }),
    };
  } finally {
    clearTimeout(timeoutId);
  }
};
