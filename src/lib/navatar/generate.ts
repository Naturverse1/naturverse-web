import { generateWithSpace } from "../hfSpaceClient";

export async function generateWithHuggingFace(prompt: string): Promise<string> {
  const result = await generateWithSpace({ prompt });

  if (typeof result.image === "string" && result.image) {
    return result.image;
  }

  if (result.errors?.length) {
    throw new Error(String(result.errors[0]));
  }

  throw new Error("Invalid image response from Hugging Face Space");
}
