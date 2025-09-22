import { callSpace, pollSpace, type GenerateRequest } from "../hfSpaceClient";

export type HuggingFaceGenerateOptions = GenerateRequest;

export async function generateWithHuggingFace(options: HuggingFaceGenerateOptions): Promise<string> {
  const { prompt } = options;
  if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
    throw new Error("Prompt required");
  }

  const { eventId } = await callSpace(options);
  const result = await pollSpace(eventId);
  const image = result?.imageDataUrl;
  if (typeof image !== "string" || !image) {
    throw new Error("Invalid image response from Hugging Face Space");
  }

  return image;
}
