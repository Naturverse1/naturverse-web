import { pollForImage, startGeneration } from "./hfClient";

export async function generateWithHuggingFace(prompt: string): Promise<string> {
  const eventId = await startGeneration([prompt]);
  return pollForImage(eventId);
}
