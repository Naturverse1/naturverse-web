const globalProcess = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process;

export async function generateWithHuggingFace(prompt: string, style: string) {
  const spaceUrl =
    import.meta.env.VITE_HUGGINGFACE_SPACE_URL ||
    globalProcess?.env?.HUGGINGFACE_SPACE_URL ||
    "";

  if (!spaceUrl) {
    throw new Error("HUGGINGFACE_SPACE_URL is not configured");
  }

  try {
    const res = await fetch(`${spaceUrl}/run/predict`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: [`${prompt}, ${style}`],
      }),
    });

    if (!res.ok) {
      throw new Error(`Space request failed: ${res.statusText}`);
    }

    const result = await res.json();
    const output = result?.data?.[0];

    if (!output) {
      throw new Error("Space response missing data");
    }

    return output;
  } catch (err) {
    console.error("HF Space error:", err);
    throw err;
  }
}
