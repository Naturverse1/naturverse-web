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

  const image = typeof json?.imageDataUrl === "string" ? json.imageDataUrl.trim() : "";
  if (!image) {
    throw new Error("Invalid image response from Hugging Face Space");
  }

  if (!image.startsWith("data:")) {
    throw new Error("Hugging Face Space returned a non-data URL image");
  }

  return image;
}
