export async function generateWithHuggingFace(prompt: string): Promise<any> {
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
  return json;
}
