export async function generateWithHuggingFace(prompt: string): Promise<string> {
  const startResponse = await fetch("/.netlify/functions/hf-space", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      prompt,
      negativePrompt: "",
      seed: 0,
      randomizeSeed: true,
      width: 1024,
      height: 1024,
      guidanceScale: 0,
      steps: 2,
    }),
  });

  const startJson = await startResponse.json().catch(() => ({}));
  const eventId = typeof startJson?.eventId === "string" ? startJson.eventId : "";

  if (!startResponse.ok || !eventId) {
    const message = typeof startJson?.error === "string" && startJson.error
      ? startJson.error
      : "Hugging Face Space error";
    throw new Error(message);
  }

  const started = Date.now();
  let imageUrl: string | null = null;

  while (Date.now() - started < 90_000) {
    const pollJson = await fetch(`/.netlify/functions/hf-space-result?eventId=${encodeURIComponent(eventId)}`)
      .then((res) => res.json().catch(() => null))
      .catch(() => null);

    if (pollJson?.status === "succeeded") {
      if (typeof pollJson.imageUrl === "string" && pollJson.imageUrl) {
        imageUrl = pollJson.imageUrl;
        break;
      }
      throw new Error("Invalid image response from Hugging Face Space");
    }

    await new Promise((resolve) => setTimeout(resolve, 1500));
  }

  if (!imageUrl) {
    throw new Error("Generation timed out — please try again.");
  }

  return imageUrl;
}
