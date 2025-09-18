export async function callAI<T>(kind: string, input: unknown): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);
  try {
    const response = await fetch("/.netlify/functions/ai", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ kind, input }),
      signal: controller.signal,
    });

    const json = await response.json().catch(() => ({ ok: false, error: "Invalid server response" }));
    if (!response.ok || !json.ok) {
      const message = json?.error || `AI failed (${response.status})`;
      throw new Error(message);
    }
    return json.data as T;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error("AI request timed out");
    }
    throw error instanceof Error ? error : new Error("AI request failed");
  } finally {
    clearTimeout(timeout);
  }
}
