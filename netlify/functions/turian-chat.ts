import type { Handler } from "@netlify/functions";

type ChatRole = "system" | "user" | "assistant";

type ChatMessage = {
  role: ChatRole;
  content: string;
};

const MODEL = "meta-llama/llama-3.1-8b-instant";
const API_URL = "https://api.groq.com/openai/v1/chat/completions";
const REQUEST_TIMEOUT_MS = 20_000;

const fallbackOrigin =
  process.env.PUBLIC_ORIGIN ??
  process.env.SITE_URL ??
  process.env.URL ??
  process.env.DEPLOY_PRIME_URL ??
  process.env.DEPLOY_URL ??
  "http://localhost:8888";

const allowedOrigins = [
  fallbackOrigin,
  process.env.PUBLIC_URL,
  process.env.PUBLIC_ORIGIN,
  process.env.SITE_URL,
  process.env.URL,
  process.env.DEPLOY_PRIME_URL,
  process.env.DEPLOY_URL,
  "http://localhost:8888",
  "http://127.0.0.1:8888",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
].filter((value, index, array): value is string => {
  return Boolean(value) && array.indexOf(value) === index;
});

const allowedOriginSet = new Set(allowedOrigins);

const baseCorsHeaders = {
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "OPTIONS,GET,POST",
  Vary: "Origin",
};

type CorsResult = {
  allowed: boolean;
  headers: Record<string, string>;
};

function resolveCors(originHeader?: string): CorsResult {
  const headers = { ...baseCorsHeaders };

  if (!originHeader) {
    if (allowedOrigins[0]) {
      headers["Access-Control-Allow-Origin"] = allowedOrigins[0];
    }
    return { allowed: true, headers };
  }

  if (allowedOriginSet.has(originHeader)) {
    headers["Access-Control-Allow-Origin"] = originHeader;
    return { allowed: true, headers };
  }

  return { allowed: false, headers };
}

function jsonResponse(
  statusCode: number,
  body: Record<string, unknown> | string,
  headers: Record<string, string>,
) {
  return {
    statusCode,
    headers: {
      ...headers,
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
    body: typeof body === "string" ? body : JSON.stringify(body),
  };
}

function readBody(eventBody: string | null | undefined) {
  if (!eventBody) return {};

  try {
    return JSON.parse(eventBody) as unknown;
  } catch {
    return {};
  }
}

function sanitizeMessages(input: unknown): ChatMessage[] | null {
  if (!Array.isArray(input)) return null;

  const trimmed = input
    .map((message) => {
      if (!message || typeof message !== "object") return null;
      const role = (message as ChatMessage).role;
      const content = (message as ChatMessage).content;

      if (role !== "system" && role !== "user" && role !== "assistant") {
        return null;
      }

      if (typeof content !== "string") {
        return null;
      }

      const safeContent = content.trim();
      if (!safeContent) {
        return null;
      }

      return {
        role,
        content: safeContent.slice(0, 4000),
      } satisfies ChatMessage;
    })
    .filter((value): value is ChatMessage => Boolean(value));

  return trimmed.length > 0 ? trimmed : null;
}

async function callGroq(messages: ChatMessage[], apiKey: string) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.6,
        max_tokens: 600,
        messages,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const text = await response.text();
      const message = text || response.statusText || "Groq error";
      return {
        ok: false,
        statusCode: response.status === 401 ? 401 : 502,
        message,
      } as const;
    }

    const json = (await response.json()) as {
      choices?: { message?: { content?: string } }[];
    };

    const content = json?.choices?.[0]?.message?.content?.trim() ?? "";
    return { ok: true, content } as const;
  } catch (error) {
    const isAbort = error instanceof Error && error.name === "AbortError";
    const message = error instanceof Error ? error.message : "Request failed";
    return {
      ok: false,
      statusCode: isAbort ? 504 : 500,
      message,
    } as const;
  } finally {
    clearTimeout(timer);
  }
}

async function checkOnline(apiKey: string | undefined) {
  if (!apiKey) {
    return { statusCode: 503, body: { status: "offline" as const } };
  }

  return { statusCode: 200, body: { status: "online" as const } };
}

export const handler: Handler = async (event) => {
  const origin = event.headers.origin ?? event.headers.Origin;
  const cors = resolveCors(origin);

  if (event.httpMethod === "OPTIONS") {
    const statusCode = cors.allowed ? 204 : 403;
    return {
      statusCode,
      headers: cors.headers,
      body: "",
    };
  }

  if (!cors.allowed) {
    return jsonResponse(403, { error: "Origin not allowed" }, cors.headers);
  }

  const apiKey = process.env.GROQ_API_KEY;

  if (event.httpMethod === "GET") {
    const status = await checkOnline(apiKey);
    return jsonResponse(status.statusCode, status.body, cors.headers);
  }

  if (event.httpMethod !== "POST") {
    return jsonResponse(405, { error: "Method not allowed" }, cors.headers);
  }

  if (!apiKey) {
    return jsonResponse(503, { error: "Missing GROQ_API_KEY" }, cors.headers);
  }

  const { messages } = readBody(event.body) as { messages?: unknown };
  const sanitized = sanitizeMessages(messages);

  if (!sanitized) {
    return jsonResponse(400, { error: "messages must be a non-empty array" }, cors.headers);
  }

  const lastMessage = sanitized[sanitized.length - 1];
  if (lastMessage.role !== "user") {
    return jsonResponse(400, { error: "Last message must be from the user" }, cors.headers);
  }

  if (lastMessage.content.length > 2000) {
    return jsonResponse(413, { error: "Message too long" }, cors.headers);
  }

  const result = await callGroq(sanitized, apiKey);

  if (!result.ok) {
    return jsonResponse(result.statusCode, { error: result.message }, cors.headers);
  }

  return jsonResponse(200, { content: result.content }, cors.headers);
};
