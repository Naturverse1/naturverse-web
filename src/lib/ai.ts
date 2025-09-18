type AiAction = 'lesson' | 'quiz' | 'card';

export async function callAI<T>(action: AiAction, prompt: string): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);
  try {
    const response = await fetch("/.netlify/functions/ai", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action, prompt }),
      signal: controller.signal,
    });

    const raw = await response.text();
    let json: any = {};
    try {
      json = raw ? JSON.parse(raw) : {};
    } catch {
      json = {};
    }

    if (!response.ok) {
      const message = typeof json?.error === "string" && json.error
        ? json.error
        : raw || `AI failed (${response.status})`;
      throw new Error(message);
    }
    return json as T;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error("AI request timed out");
    }
    throw error instanceof Error ? error : new Error("AI request failed");
  } finally {
    clearTimeout(timeout);
  }
}
