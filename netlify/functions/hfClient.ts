import fetch from "node-fetch";

const HF_URL = process.env.HF_SPACE_URL;

if (!HF_URL) {
  throw new Error("HF_SPACE_URL is not defined in environment variables");
}

export async function generateImage(prompt: string) {
  const payload = {
    data: [prompt, "", 0, true, 1024, 1024, 0, 2],
  };

  let lastError;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(`${HF_URL}/gradio_api/call/infer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        lastError = new Error(`HF request failed: ${res.status} ${res.statusText}`);
        await new Promise((r) => setTimeout(r, 5000));
        continue;
      }

      const text = await res.text();

      try {
        return JSON.parse(text);
      } catch {
        console.warn("HF returned non-JSON response, returning raw text snippet");
        return { raw: text.slice(0, 500) };
      }
    } catch (err) {
      lastError = err;
      await new Promise((r) => setTimeout(r, 5000));
    }
  }

  throw lastError || new Error("HF Space unavailable after retries");
}
