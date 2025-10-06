import type { Handler } from "@netlify/functions";

const JSON_HEADERS = { "Content-Type": "application/json" } as const;
const ALLOWED_PROVIDERS = new Set(["openai", "stability", "huggingface", "deepai"] as const);

type Provider = "openai" | "stability" | "huggingface" | "deepai";

type ImageRequest = {
  prompt?: string;
  size?: string | number;
  provider?: Provider;
};

export const config = {
  maxDuration: 26,
};

export const handler: Handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers: {
        ...JSON_HEADERS,
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST,OPTIONS",
      },
      body: "",
    };
  }

  if (event.httpMethod !== "POST") {
    return json(405, { error: "method_not_allowed" });
  }

  let payload: ImageRequest;
  try {
    payload = JSON.parse(event.body || "{}") as ImageRequest;
  } catch (error: any) {
    return json(400, { error: "invalid_json", detail: error?.message ?? String(error) });
  }

  const prompt = typeof payload.prompt === "string" ? payload.prompt.trim() : "";
  if (!prompt) {
    return json(400, { error: "prompt_required" });
  }

  const requestedProvider = (payload.provider ?? "openai") as Provider;
  if (!ALLOWED_PROVIDERS.has(requestedProvider)) {
    return json(400, { error: "invalid_provider" });
  }

  const size = normaliseSize(payload.size);

  try {
    const imageUrl = await generateImage({ prompt, provider: requestedProvider, size });
    return json(200, { imageUrl });
  } catch (error: any) {
    console.error("Generation Error", error);
    const message = error?.message ?? "unknown_error";
    const status = typeof error?.statusCode === "number" ? error.statusCode : 500;
    return json(status, { error: message });
  }
};

type GenerateInput = { prompt: string; provider: Provider; size: string };

async function generateImage({ prompt, provider, size }: GenerateInput): Promise<string> {
  switch (provider) {
    case "openai":
      return generateWithOpenAI(prompt, size);
    case "stability":
      return generateWithStability(prompt, size);
    case "huggingface":
      return generateWithHuggingFace(prompt);
    case "deepai":
      return generateWithDeepAI(prompt);
    default:
      throw new Error("unsupported_provider");
  }
}

async function generateWithOpenAI(prompt: string, size: string): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw Object.assign(new Error("missing_openai_key"), { statusCode: 500 });
  }

  const response = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      ...JSON_HEADERS,
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ model: "gpt-image-1", prompt, size }),
  });

  if (!response.ok) {
    const detail = await safeReadText(response);
    throw Object.assign(new Error(parseError(detail)), { statusCode: response.status });
  }

  const data = await response.json().catch(() => null);
  const url = data?.data?.[0]?.url;
  if (typeof url !== "string" || !url) {
    throw new Error("openai_no_image");
  }

  return url;
}

async function generateWithStability(prompt: string, size: string): Promise<string> {
  const apiKey = process.env.STABILITY_API_KEY;
  if (!apiKey) {
    throw Object.assign(new Error("missing_stability_key"), { statusCode: 500 });
  }

  const { width, height } = sizeToDimensions(size);

  const response = await fetch("https://api.stability.ai/v2beta/stable-image/generate/core", {
    method: "POST",
    headers: {
      ...JSON_HEADERS,
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ prompt, width, height }),
  });

  if (!response.ok) {
    const detail = await safeReadText(response);
    throw Object.assign(new Error(parseError(detail)), { statusCode: response.status });
  }

  const data = await response.json().catch(() => null);
  const url = data?.artifacts?.[0]?.url;
  if (typeof url !== "string" || !url) {
    throw new Error("stability_no_image");
  }

  return url;
}

async function generateWithHuggingFace(prompt: string): Promise<string> {
  const apiKey = process.env.HUGGINGFACE_API_KEY;
  const spaceUrl = process.env.HF_SPACE_URL;
  if (!apiKey || !spaceUrl) {
    throw Object.assign(new Error("missing_huggingface_key"), { statusCode: 500 });
  }

  const response = await fetch(spaceUrl, {
    method: "POST",
    headers: {
      ...JSON_HEADERS,
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ inputs: prompt }),
  });

  if (!response.ok) {
    const detail = await safeReadText(response);
    throw Object.assign(new Error(parseError(detail)), { statusCode: response.status });
  }

  const buffer = await response.arrayBuffer();
  return `data:image/png;base64,${Buffer.from(buffer).toString("base64")}`;
}

async function generateWithDeepAI(prompt: string): Promise<string> {
  const apiKey = process.env.DEEPAI_API_KEY;
  if (!apiKey) {
    throw Object.assign(new Error("missing_deepai_key"), { statusCode: 500 });
  }

  const response = await fetch("https://api.deepai.org/api/text2img", {
    method: "POST",
    headers: {
      ...JSON_HEADERS,
      "api-key": apiKey,
    },
    body: JSON.stringify({ text: prompt }),
  });

  if (!response.ok) {
    const detail = await safeReadText(response);
    throw Object.assign(new Error(parseError(detail)), { statusCode: response.status });
  }

  const data = await response.json().catch(() => null);
  const url = data?.output_url;
  if (typeof url !== "string" || !url) {
    throw new Error("deepai_no_image");
  }

  return url;
}

function json(statusCode: number, payload: unknown) {
  return {
    statusCode,
    headers: {
      ...JSON_HEADERS,
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify(payload),
  };
}

function normaliseSize(value: string | number | undefined): string {
  if (typeof value === "number" && Number.isFinite(value)) {
    const clamped = clamp(Math.floor(value), 256, 2048);
    return `${clamped}x${clamped}`;
  }

  if (typeof value === "string") {
    const trimmed = value.trim().toLowerCase();
    const match = trimmed.match(/^(\d{2,4})x(\d{2,4})$/);
    if (match) {
      const width = clamp(Number(match[1]), 256, 2048);
      const height = clamp(Number(match[2]), 256, 2048);
      return `${width}x${height}`;
    }
    const numeric = Number(trimmed);
    if (Number.isFinite(numeric)) {
      const clamped = clamp(Math.floor(numeric), 256, 2048);
      return `${clamped}x${clamped}`;
    }
  }

  return "1024x1024";
}

function sizeToDimensions(size: string): { width: number; height: number } {
  const [width, height] = size.split("x").map((part) => clamp(Number(part), 256, 2048));
  return {
    width: width || 1024,
    height: height || 1024,
  };
}

function clamp(value: number, min: number, max: number) {
  if (!Number.isFinite(value)) return min;
  return Math.min(Math.max(value, min), max);
}

async function safeReadText(response: Response): Promise<string> {
  try {
    return await response.text();
  } catch {
    return "";
  }
}

function parseError(detail: string) {
  if (!detail) return "generation_failed";
  try {
    const parsed = JSON.parse(detail);
    if (parsed && typeof parsed === "object" && "error" in parsed) {
      const error = (parsed as any).error;
      if (typeof error === "string" && error) return error;
      if (error && typeof error === "object" && typeof error.message === "string") {
        return error.message;
      }
    }
  } catch {
    // ignore
  }
  return detail.slice(0, 10_000);
}
