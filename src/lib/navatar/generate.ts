import { pollResult, startGeneration } from "../hf";

export async function generateWithHuggingFace(prompt: string): Promise<string> {
  const id = await startGeneration({ prompt });
  return pollResult(id);
}
