export async function jsonFetch<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(input, init);
  } catch (error: any) {
    const message = error?.message || String(error) || "Network request failed";
    throw new Error(message);
  }

  const text = await response.text();
  let data: any = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    const message = typeof data?.error === "string" ? data.error : response.statusText || "Request failed";
    const err = new Error(message || `Request failed with status ${response.status}`);
    (err as any).status = response.status;
    if (data && typeof data === "object" && "details" in data) {
      (err as any).details = (data as Record<string, unknown>).details;
    }
    throw err;
  }

  if (data === null) {
    throw new Error("invalid_json_response");
  }

  return data as T;
}
