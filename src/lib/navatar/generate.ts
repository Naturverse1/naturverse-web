export async function generateWithHuggingFace(prompt: string): Promise<string> {
  const response = await fetch("/.netlify/functions/hf-generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt }),
  });

  const json = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      (json && typeof json.error === "string" && json.error) ||
      "Hugging Face API error";
    throw new Error(message);
  }

  const image = json && typeof json.image === "string" ? json.image : null;
  if (!image) {
    throw new Error("Invalid image response from Hugging Face");
  }

  return image;
}
