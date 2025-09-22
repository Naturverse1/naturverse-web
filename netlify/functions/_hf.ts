import type { HandlerResponse } from "@netlify/functions";

export interface SpaceConfig {
  rawBase: string;
  hfBase: string;
}

const SPACE_ENV_KEYS = [
  "HF_SPACE_URL",
  "HUGGINGFACE_SPACE_URL",
  "HUGGINGFACE_SPACE",
];

const TOKEN_ENV_KEYS = [
  "HF_API_TOKEN",
  "HUGGINGFACE_API_KEY",
  "HUGGINGFACE_TOKEN",
  "HUGGINGFACEHUB_API_TOKEN",
];

export function getSpaceConfig(): SpaceConfig | null {
  for (const key of SPACE_ENV_KEYS) {
    const raw = process.env[key];
    if (!raw) continue;
    const trimmed = raw.trim();
    if (!trimmed) continue;
    const withoutTrailing = trimmed.replace(/\/+$/, "");
    if (!withoutTrailing) continue;
    const match = withoutTrailing.match(/^https?:\/\/huggingface\.co\/spaces\/([^/]+)\/([^/]+)$/i);
    const hfBase = match ? `https://${match[1]}-${match[2]}.hf.space` : withoutTrailing;
    return { rawBase: withoutTrailing, hfBase };
  }
  return null;
}

export function getBearerToken(): string | null {
  for (const key of TOKEN_ENV_KEYS) {
    const raw = process.env[key];
    if (!raw) continue;
    const trimmed = raw.trim();
    if (trimmed) return trimmed;
  }
  return null;
}

export function jsonResponse(statusCode: number, body: unknown, extraHeaders?: Record<string, string>): HandlerResponse {
  return {
    statusCode,
    headers: {
      "content-type": "application/json",
      "cache-control": "no-store, no-cache, must-revalidate, max-age=0",
      ...(extraHeaders ?? {}),
    },
    body: JSON.stringify(body ?? {}),
  };
}

export function extractImageUrl(payload: any, config: SpaceConfig): string | null {
  if (payload == null) return null;

  const tryValue = (value: any): string | null => {
    if (!value) return null;

    if (typeof value === "string") {
      const trimmed = value.trim();
      if (!trimmed) return null;
      if (/^data:image\//i.test(trimmed)) return trimmed;
      if (/^https?:\/\//i.test(trimmed)) return trimmed;
      if (trimmed.startsWith("file=")) {
        const name = trimmed.replace(/^file=*/, "").replace(/^\/+/, "");
        if (!name) return null;
        return `${config.rawBase}/${name}`;
      }
      if (trimmed.startsWith("/")) {
        return `${config.rawBase}${trimmed}`;
      }
      return `${config.rawBase}/${trimmed.replace(/^\/+/, "")}`;
    }

    if (typeof value === "object") {
      if (typeof value.url === "string" && value.url.trim()) {
        return tryValue(value.url);
      }
      if (typeof value.href === "string" && value.href.trim()) {
        return tryValue(value.href);
      }
      if (typeof value.data === "string" && value.data.trim()) {
        const dataTrimmed = value.data.trim();
        if (/^data:image\//i.test(dataTrimmed)) return dataTrimmed;
        return `data:image/png;base64,${dataTrimmed}`;
      }
      if (typeof value.name === "string" && value.name.trim()) {
        return tryValue(value.name);
      }
      if (Array.isArray(value.data)) {
        for (const inner of value.data) {
          const found = tryValue(inner);
          if (found) return found;
        }
      }
    }

    return null;
  };

  const direct = tryValue(payload);
  if (direct) return direct;

  const candidateFields = ["data", "output", "outputs", "result", "results"]; // best effort
  for (const field of candidateFields) {
    const candidate = (payload as any)[field];
    if (Array.isArray(candidate)) {
      for (const item of candidate) {
        const found = tryValue(item);
        if (found) return found;
      }
    } else if (candidate) {
      const found = tryValue(candidate);
      if (found) return found;
    }
  }

  if (Array.isArray(payload)) {
    for (const entry of payload) {
      const found = tryValue(entry);
      if (found) return found;
    }
  }

  return null;
}
