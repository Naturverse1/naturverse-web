const SPACE_HINT = "https://{owner}-{space}.hf.space";

type MaybeEnv = Record<string, unknown> | undefined | null;

function readEnv(env: MaybeEnv, key: string): string | undefined {
  if (!env) return undefined;
  const value = env[key];
  return typeof value === "string" && value.trim() ? value : undefined;
}

function normalizeFromPath(raw: string): string | null {
  const cleaned = raw.replace(/^https?:\/\//i, "").replace(/^\/+/g, "").replace(/\/+$/g, "");
  const parts = cleaned.split("/").filter(Boolean);
  if (parts.length >= 2) {
    const [owner, space] = parts;
    if (owner && space) {
      return `https://${owner}-${space}.hf.space`;
    }
  }
  return null;
}

function normalizeSpace(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  const hfMatch = trimmed.match(/huggingface\.co\/spaces\/([^\/\s]+)\/([^\/\s?#]+)/i);
  if (hfMatch) {
    const [, owner, space] = hfMatch;
    if (owner && space) {
      return `https://${owner}-${space}.hf.space`;
    }
  }

  const fromPath = normalizeFromPath(trimmed);
  if (fromPath) return fromPath;

  const candidate = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  try {
    const url = new URL(candidate);

    if (url.hostname === "huggingface.co") {
      const parts = url.pathname.split("/").filter(Boolean);
      if (parts.length >= 3 && parts[0] === "spaces") {
        const owner = parts[1];
        const space = parts[2];
        if (owner && space) {
          return `https://${owner}-${space}.hf.space`;
        }
      }
    }

    if (!url.hostname.includes(".")) {
      return null;
    }

    if (url.hostname.endsWith(".hf.space")) {
      return `https://${url.hostname}`;
    }

    return url.origin.replace(/\/+$/, "");
  } catch {
    return null;
  }
}

export function getSpaceUrl(): string | null {
  let raw: string | undefined;

  try {
    const metaEnv = (typeof import.meta !== "undefined" && (import.meta as any)?.env) as MaybeEnv;
    raw = readEnv(metaEnv, "HF_SPACE_URL") ?? readEnv(metaEnv, "HUGGINGFACE_SPACE_URL");
  } catch {
    // ignore
  }

  if (!raw) {
    const processEnv = typeof process !== "undefined" ? process?.env : undefined;
    raw = readEnv(processEnv, "HF_SPACE_URL") ?? readEnv(processEnv, "HUGGINGFACE_SPACE_URL");
  }

  if (!raw) return null;

  const normalized = normalizeSpace(raw);
  if (normalized) return normalized;

  console.warn(
    "Unable to normalize HF Space URL. Expected formats include",
    SPACE_HINT,
    "or https://huggingface.co/spaces/{owner}/{space}."
  );
  return null;
}

