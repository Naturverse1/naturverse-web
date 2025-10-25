import type { HandlerResponse } from "@netlify/functions";

type JsonValue = Record<string, unknown>;

const COMMON_HEADERS = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "POST, OPTIONS",
  "access-control-allow-headers": "content-type, authorization",
} as const;

export function withCors(json: JsonValue, statusCode = 200): HandlerResponse {
  return {
    statusCode,
    headers: {
      ...COMMON_HEADERS,
      "content-type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(json),
  };
}

export function preflight(): HandlerResponse {
  return {
    statusCode: 204,
    headers: {
      ...COMMON_HEADERS,
      "access-control-max-age": "86400",
    },
    body: "",
  };
}
