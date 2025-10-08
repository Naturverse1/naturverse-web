import { jsonPost, type JsonPostError } from "../jsonPost";
import { providerEndpoint, providerLabel, type Provider } from "./providers";

type GenerateRequest = {
  provider: Provider;
  prompt: string;
  size?: number;
};

type ImageResponse = {
  imageUrl: string;
  provider: Provider;
};

export async function generateImage({ provider, prompt, size }: GenerateRequest): Promise<ImageResponse> {
  const endpoint = providerEndpoint(provider);
  const payload: Record<string, unknown> = { prompt };
  if (typeof size === "number" && Number.isFinite(size)) {
    payload.size = size;
  }

  try {
    const result = await jsonPost<ImageResponse>(endpoint, payload);

    if (!result || typeof result.imageUrl !== "string" || result.imageUrl.length === 0) {
      throw createClientError(provider, {
        message: "invalid_image_response",
      });
    }

    return {
      imageUrl: result.imageUrl,
      provider: (result.provider as Provider) ?? provider,
    };
  } catch (error) {
    throw createClientError(provider, error);
  }
}

type NormalisedError = {
  message?: string;
  status?: number;
  code?: string | number;
  errorKey?: string;
};

function createClientError(provider: Provider, error: unknown): Error {
  if (error instanceof ImageGenerationError) {
    return error;
  }

  const base = normaliseError(error);
  const message = friendlyMessage(provider, base);
  return new ImageGenerationError(message, {
    provider,
    code: base.code,
    status: base.status,
    errorKey: base.errorKey,
    cause: error instanceof Error ? error : undefined,
  });
}

function normaliseError(error: unknown): NormalisedError {
  if (typeof error === "string") {
    return { message: error };
  }
  if (error && typeof error === "object") {
    const record = error as Partial<JsonPostError & { code?: string | number }> & {
      message?: string;
    };
    return {
      message: record.message,
      status: record.status,
      code: record.code,
      errorKey: (record as any).errorKey,
    };
  }
  return {};
}

function friendlyMessage(provider: Provider, error: NormalisedError): string {
  const label = providerLabel(provider);
  const key = typeof error.errorKey === "string" ? error.errorKey : undefined;
  const status = typeof error.status === "number" ? error.status : undefined;
  const code =
    typeof error.code === "string"
      ? error.code
      : typeof error.code === "number"
        ? String(error.code)
        : undefined;

  const specific = providerSpecificMessage(provider, key, code, status);
  if (specific) {
    return specific;
  }

  if (key === "prompt_required") {
    return "Enter a description first.";
  }
  if (key === "timeout" || status === 504) {
    return `${label} timed out. Try again in a moment.`;
  }
  if (key === "network_error") {
    return `Network error while contacting ${label}. Try again.`;
  }
  if (key === "no_image") {
    return `${label} did not return an image. Try another prompt.`;
  }
  if (key === "rate_limited") {
    return `${label} rate limit hit. Try again soon.`;
  }
  if (key === "invalid_request") {
    return "The request was rejected. Try adjusting your description.";
  }
  if (key === "content_policy") {
    return "Your prompt was rejected. Try rephrasing it.";
  }
  if (key === "unauthorized" || status === 401 || status === 403) {
    return `${label} is unavailable right now. Try another provider.`;
  }
  if (key === "upstream_error" && (status === 502 || status === 503 || status === 504)) {
    return `${label} is unavailable right now. Try another provider.`;
  }
  if (error.message === "invalid_image_response") {
    return `${label} returned an unexpected response. Try again.`;
  }

  return error.message || `${label} request failed. Try again.`;
}

function providerSpecificMessage(
  provider: Provider,
  key?: string,
  code?: string,
  status?: number,
): string | undefined {
  if (provider === "deepai" && (key === "quota_exceeded" || code === "credits_exhausted")) {
    return "DeepAI credits are exhausted.";
  }
  if (provider === "stability") {
    if (key === "upstream_error" || key === "timeout" || key === "network_error") {
      return "Stability AI is unavailable right now. Try another provider.";
    }
    if (status === 502 || status === 503) {
      return "Stability AI is unavailable right now. Try another provider.";
    }
  }
  return undefined;
}

export class ImageGenerationError extends Error {
  provider: Provider;
  code?: string | number;
  status?: number;
  errorKey?: string;

  constructor(
    message: string,
    options: {
      provider: Provider;
      code?: string | number;
      status?: number;
      errorKey?: string;
      cause?: Error | undefined;
    },
  ) {
    super(message, options.cause ? { cause: options.cause } : undefined);
    this.name = "ImageGenerationError";
    this.provider = options.provider;
    this.code = options.code;
    this.status = options.status;
    this.errorKey = options.errorKey;
  }
}
