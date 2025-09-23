export async function generateWithHuggingFace(prompt: string): Promise<string> {
  const response = await fetch("/.netlify/functions/generate-hf", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });

  let body: unknown;
  try {
    body = await response.json();
  } catch {
    const text = await response.text();
    throw new Error(`HF request returned non-JSON: ${text.slice(0, 200)}`);
  }

  if (!response.ok) {
    const message =
      typeof body === "object" && body !== null && "error" in body && typeof (body as { error?: unknown }).error === "string"
        ? (body as { error: string }).error
        : "HF API error";
    throw new Error(message);
  }

  const image =
    typeof body === "object" && body !== null && "image" in body && typeof (body as { image?: unknown }).image === "string"
      ? (body as { image: string }).image
      : undefined;

  if (!image) {
    throw new Error("HF API did not return an image");
  }

  return image;
}
