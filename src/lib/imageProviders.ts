import {
  RateLimitError,
  StabilityError,
  generateWithStability,
  normalizeSeed,
} from "@/lib/navatar/stability";

export type GenOptions = {
  prompt: string;
  negativePrompt?: string;
  seed?: number | string;
  size?: number; // px edge
  style?: string;
  signal?: AbortSignal;
};

export type Provider = "auto" | "deepai" | "stability" | "dicebear";

export type ProviderResult = {
  blob: Blob;
  provider: Exclude<Provider, "auto">;
  remaining?: number | null;
};

const toBlob = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Fetch failed: ${res.status}`);
  }
  return await res.blob();
};

async function callDeepAI({ prompt, negativePrompt, size = 1024 }: GenOptions): Promise<ProviderResult> {
  const key = import.meta.env.VITE_DEEPAI_API_KEY as string | undefined;
  if (!key) {
    throw new Error("DeepAI not configured");
  }

  const promptParts = [prompt];
  if (negativePrompt?.trim()) {
    promptParts.push(`Avoid: ${negativePrompt.trim()}`);
  }

  const res = await fetch("https://api.deepai.org/api/text2img", {
    method: "POST",
    headers: { "api-key": key },
    body: new URLSearchParams({
      text: promptParts.filter(Boolean).join("\n"),
      width: String(size),
      height: String(size),
    }),
  });

  if (!res.ok) {
    throw new Error(`DeepAI error ${res.status}`);
  }

  const json = await res.json();
  const url: string | undefined =
    typeof json?.output_url === "string"
      ? json.output_url
      : Array.isArray(json?.output_url)
        ? json.output_url[0]
        : undefined;
  if (!url) {
    throw new Error("DeepAI did not return output_url");
  }

  const blob = await toBlob(url);
  return { blob, provider: "deepai" };
}

async function callStability({
  prompt,
  negativePrompt,
  seed,
  style,
  signal,
}: GenOptions): Promise<ProviderResult> {
  const numericSeed = typeof seed === "string" ? Number(seed) : seed;
  const normalizedSeed = normalizeSeed(
    typeof numericSeed === "number" && Number.isFinite(numericSeed) ? numericSeed : undefined,
  );

  const { blob, remaining } = await generateWithStability({
    prompt,
    negativePrompt,
    seed: normalizedSeed,
    style,
    signal,
  });

  return { blob, provider: "stability", remaining };
}

async function callDiceBear({ seed, size = 1024 }: GenOptions): Promise<ProviderResult> {
  const resolvedSeed =
    typeof seed === "string"
      ? seed
      : typeof seed === "number" && Number.isFinite(seed)
        ? String(seed)
        : typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : Math.random().toString(36).slice(2, 10);
  const url = `https://api.dicebear.com/7.x/adventurer/png?seed=${encodeURIComponent(
    resolvedSeed,
  )}&size=${size}&backgroundColor=transparent`;

  const blob = await toBlob(url);
  return { blob, provider: "dicebear" };
}

export async function generateWithProvider(
  provider: Provider,
  opts: GenOptions,
): Promise<ProviderResult> {
  if (provider === "deepai") {
    return await callDeepAI(opts);
  }
  if (provider === "stability") {
    return await callStability(opts);
  }
  if (provider === "dicebear") {
    return await callDiceBear(opts);
  }

  try {
    return await callDeepAI(opts);
  } catch (error) {
    console.warn("DeepAI failed, falling back", error);
  }

  try {
    return await callStability(opts);
  } catch (error) {
    if (error instanceof RateLimitError || error instanceof StabilityError) {
      console.warn("Stability unavailable, falling back to DiceBear", error);
    } else {
      console.warn("Stability failed, falling back", error);
    }
  }

  return await callDiceBear(opts);
}
