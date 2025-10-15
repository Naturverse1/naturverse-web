export async function jsonPost<T = unknown>(
  url: string,
  body: Record<string, unknown>,
): Promise<T> {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });

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
    const detail =
      (data && (data.details || data.error)) || text || `HTTP ${response.status}`;
    throw new Error(typeof detail === "string" ? detail : "Request failed");
  }

  return data as T;
}
