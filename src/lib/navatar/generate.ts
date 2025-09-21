export async function generateWithHuggingFace(prompt: string): Promise<string> {
  const response = await fetch("/.netlify/functions/hf-space", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ prompt }),
  });

  const json = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = Array.isArray(json?.errors) && json.errors.length > 0
      ? json.errors[0]
      : "Hugging Face Space error";
    throw new Error(message);
  }

  const image = json?.imageDataUrl;
  if (typeof image !== "string" || !image) {
    throw new Error("Invalid image response from Hugging Face Space");
  }

  return image;
}
