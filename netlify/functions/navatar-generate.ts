import type { Handler } from "@netlify/functions";

const json = (status: number, body: unknown) => ({
  statusCode: status,
  headers: { "content-type": "application/json" },
  body: JSON.stringify(body),
});

type Provider = "auto" | "openai" | "stability" | "deepai" | "huggingface" | "multiavatar";

type ProviderResult = { dataUrl: string; provider: Exclude<Provider, "auto"> };

const DEFAULT_SIZE = 1024;

const normalizeSize = (value: unknown): number => {
  if (typeof value !== "number" || Number.isNaN(value)) return DEFAULT_SIZE;
  return Math.min(Math.max(Math.round(value), 256), 2048);
};

async function callOpenAI(prompt: string, size: number): Promise<ProviderResult> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY missing");
  const resolved = size >= 1024 ? "1024x1024" : size >= 512 ? "512x512" : "256x256";
  const response = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      authorization: `Bearer ${apiKey}`,
      "content-type": "application/json",
      ...(process.env.OPENAI_PROJECT_ID ? { "OpenAI-Project": process.env.OPENAI_PROJECT_ID } : {}),
    },
    body: JSON.stringify({
      model: "gpt-image-1",
      prompt,
      size: resolved,
      response_format: "b64_json",
    }),
  });
  if (!response.ok) throw new Error(`openai ${response.status}`);
  const data: any = await response.json();
  const b64 = data?.data?.[0]?.b64_json;
  if (!b64) throw new Error("openai invalid response");
  return { dataUrl: `data:image/png;base64,${b64}`, provider: "openai" };
}

async function callStability(prompt: string, size: number): Promise<ProviderResult> {
  const apiKey = process.env.STABILITY_API_KEY;
  if (!apiKey) throw new Error("STABILITY_API_KEY missing");
  const dim = Math.min(Math.max(Math.round(size), 256), 1024);
  const response = await fetch(
    "https://api.stability.ai/v1/generation/stable-diffusion-v1-6/text-to-image",
    {
      method: "POST",
      headers: {
        authorization: `Bearer ${apiKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        cfg_scale: 7,
        height: dim,
        width: dim,
        samples: 1,
        steps: 30,
        text_prompts: [{ text: prompt }],
      }),
    },
  );
  if (!response.ok) throw new Error(`stability ${response.status}`);
  const data: any = await response.json();
  const art = data?.artifacts?.[0]?.base64;
  if (!art) throw new Error("stability invalid response");
  return { dataUrl: `data:image/png;base64,${art}`, provider: "stability" };
}

async function callDeepAI(prompt: string, size: number): Promise<ProviderResult> {
  const apiKey = process.env.DEPAI_API_KEY ?? process.env.DEEPAI_API_KEY;
  if (!apiKey) throw new Error("DEEPAI_API_KEY missing");
  const response = await fetch("https://api.deepai.org/api/text2img", {
    method: "POST",
    headers: { "api-key": apiKey, "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ text: prompt, width: String(size), height: String(size) }),
  });
  if (!response.ok) throw new Error(`deepai ${response.status}`);
  const data: any = await response.json();
  if (!data?.output_url) throw new Error("deepai invalid response");
  const imageResponse = await fetch(data.output_url);
  if (!imageResponse.ok) throw new Error(`deepai image ${imageResponse.status}`);
  const buffer = Buffer.from(await imageResponse.arrayBuffer());
  return { dataUrl: `data:image/jpeg;base64,${buffer.toString("base64")}`, provider: "deepai" };
}

async function callHuggingFace(prompt: string): Promise<ProviderResult> {
  const apiKey = process.env.HF_API_TOKEN;
  if (!apiKey) throw new Error("HF_API_TOKEN missing");
  const model = process.env.HF_MODEL_ID ?? "runwayml/stable-diffusion-v1-5";
  const response = await fetch(
    `https://api-inference.huggingface.co/models/${encodeURIComponent(model)}`,
    {
      method: "POST",
      headers: { authorization: `Bearer ${apiKey}`, "content-type": "application/json" },
      body: JSON.stringify({ inputs: prompt }),
    },
  );
  if (!response.ok) throw new Error(`hf ${response.status}`);
  const buffer = Buffer.from(await response.arrayBuffer());
  return { dataUrl: `data:image/png;base64,${buffer.toString("base64")}`, provider: "huggingface" };
}

async function callMultiavatar(seed: string): Promise<ProviderResult> {
  const response = await fetch(`https://api.multiavatar.com/${encodeURIComponent(seed)}.svg`);
  if (!response.ok) throw new Error(`multiavatar ${response.status}`);
  const svg = await response.text();
  return {
    dataUrl: `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`,
    provider: "multiavatar",
  };
}

async function tryAuto(prompt: string, size: number): Promise<ProviderResult> {
  const steps: Array<[Exclude<Provider, "auto">, () => Promise<ProviderResult>]> = [
    ["openai", () => callOpenAI(prompt, size)],
    ["stability", () => callStability(prompt, size)],
    ["deepai", () => callDeepAI(prompt, size)],
    ["huggingface", () => callHuggingFace(prompt)],
    ["multiavatar", () => callMultiavatar(prompt.slice(0, 60) || "naturverse")],
  ];
  const errors: string[] = [];
  for (const [provider, step] of steps) {
    try {
      return await step();
    } catch (error: any) {
      errors.push(`${provider}: ${error?.message ?? error}`);
    }
  }
  throw new Error(`All providers failed: ${errors.join(" | ")}`);
}

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return json(405, { error: "Method not allowed" });
  }
  try {
    const { prompt, provider, size }: { prompt?: string; provider?: Provider; size?: number } =
      JSON.parse(event.body ?? "{}");
    if (!prompt) {
      return json(400, { error: "prompt required" });
    }

    const selected: Provider = provider ?? "auto";
    const normalizedSize = normalizeSize(size);
    let result: ProviderResult;

    switch (selected) {
      case "openai":
        result = await callOpenAI(prompt, normalizedSize);
        break;
      case "stability":
        result = await callStability(prompt, normalizedSize);
        break;
      case "deepai":
        result = await callDeepAI(prompt, normalizedSize);
        break;
      case "huggingface":
        result = await callHuggingFace(prompt);
        break;
      case "multiavatar":
        result = await callMultiavatar(prompt);
        break;
      case "auto":
      default:
        result = await tryAuto(prompt, normalizedSize);
        break;
    }

    return json(200, { ok: true, dataUrl: result.dataUrl, provider: result.provider });
  } catch (error: any) {
    return json(200, { ok: false, error: error?.message ?? "failed" });
  }
};
