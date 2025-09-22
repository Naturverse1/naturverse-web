import { generateViaSpace, isSpaceConfigured as checkSpaceConfigured, spaceMissingMessage } from "../generate/hfClient";

export async function generateWithHuggingFace(prompt: string): Promise<string> {
  const { imageDataUrl } = await generateViaSpace(prompt);
  if (typeof imageDataUrl !== "string" || !imageDataUrl) {
    throw new Error("Invalid image response from Hugging Face Space");
  }
  return imageDataUrl;
}

export function isSpaceConfigured(): boolean {
  return checkSpaceConfigured();
}

export function missingSpaceMessage(): string {
  return spaceMissingMessage();
}

