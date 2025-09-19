export type AIAction = "lesson" | "quiz" | "card" | "backstory";

type AIParams = {
  prompt: string;
  age?: number;
};

export async function callAI<T>(action: AIAction, params: AIParams): Promise<T> {
  const prompt = String(params.prompt ?? "").trim();
  if (!prompt) {
    throw new Error("Prompt is required");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);

  try {
    const response = await fetch("/.netlify/functions/ai", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action, prompt, age: params.age }),
      signal: controller.signal,
    });

    const text = await response.text();
    let json: any = null;
    try {
      json = JSON.parse(text);
    } catch {
      // ignore, handled below
    }

    if (!response.ok || !json?.ok) {
      const message =
        (json && typeof json.error === "string" && json.error) ||
        (text && !response.ok ? text : "AI request failed");
      throw new Error(message || `AI failed (${response.status})`);
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
