import type { HFOptions } from "../hf";
import { generateWithHF } from "../hf";

export type { HFOptions } from "../hf";

export async function generateWithHuggingFace(prompt: string, options: HFOptions = {}) {
  return generateWithHF(prompt, options);
}
