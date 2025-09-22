import { getSpaceUrl } from "../env";

export type GenResult = { imageDataUrl: string };

const SPACE_MISSING_MESSAGE =
  "Set HF_SPACE_URL (or HUGGINGFACE_SPACE_URL) to enable Hugging Face generations.";

function ensureSpaceConfigured(): string {
  const base = getSpaceUrl();
  if (!base) {
    throw new Error(SPACE_MISSING_MESSAGE);
  }
  return base;
}

export function isSpaceConfigured(): boolean {
  return Boolean(getSpaceUrl());
}

export interface GenerateSpaceOptions {
  prompt: string;
  negative?: string;
  seed?: number;
  size?: number;
}

export async function generateViaSpace(
  promptOrOptions: string | GenerateSpaceOptions,
  negative?: string,
  seed = 0,
  size = 1024
): Promise<GenResult> {
  const options: GenerateSpaceOptions =
    typeof promptOrOptions === "string"
      ? { prompt: promptOrOptions, negative, seed, size }
      : promptOrOptions;

  const trimmed = options.prompt?.trim();
  if (!trimmed) {
    throw new Error("Prompt required");
  }

  ensureSpaceConfigured();

  const payload = {
    prompt: trimmed,
    negative: options.negative ?? "",
    seed: typeof options.seed === "number" ? options.seed : 0,
    size: typeof options.size === "number" && Number.isFinite(options.size) ? options.size : 1024,
  };

  const response = await fetch("/.netlify/functions/hf-generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = typeof body?.error === "string" && body.error.trim()
      ? body.error
      : `Request failed: ${response.status}`;
    throw new Error(message);
  }

  return body as GenResult;
}

export function spaceMissingMessage(): string {
  return SPACE_MISSING_MESSAGE;
}

