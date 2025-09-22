import { startGeneration, waitForImage } from "../hfSpaceClient";

export async function generateWithHuggingFace(prompt: string): Promise<string> {
  const eventId = await startGeneration({ prompt, width: 1024, height: 1024 });
  const { image } = await waitForImage(eventId);

  if (typeof image !== "string" || !image) {
    throw new Error("Invalid image response from Hugging Face Space");
  }

  return image;
}
