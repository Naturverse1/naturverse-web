import { pollJob, startJob, type PollResp, type StartResp } from "../hf";

export type HfStatus = "starting" | "polling";

export interface HuggingFaceGenerateOptions {
  prompt: string;
  negativePrompt?: string;
  seed?: number;
  randomizeSeed?: boolean;
  width?: number;
  height?: number;
  guidanceScale?: number;
  steps?: number;
  timeoutMs?: number;
  pollIntervalMs?: number;
  onStatusChange?: (status: HfStatus) => void;
}

const DEFAULT_TIMEOUT_MS = 60_000;
const DEFAULT_POLL_INTERVAL_MS = 1_200;
const FALLBACK_PROMPT = "Hello!!";

export async function generateWithHuggingFace(options: HuggingFaceGenerateOptions): Promise<string> {
  const {
    prompt,
    negativePrompt = "",
    seed = 0,
    randomizeSeed = true,
    width = 1024,
    height = 1024,
    guidanceScale = 0,
    steps = 2,
    timeoutMs = DEFAULT_TIMEOUT_MS,
    pollIntervalMs = DEFAULT_POLL_INTERVAL_MS,
    onStatusChange,
  } = options;

  const payload = {
    data: [
      prompt?.trim() ? prompt : FALLBACK_PROMPT,
      typeof negativePrompt === "string" ? negativePrompt : "",
      Number.isFinite(seed) ? seed : 0,
      Boolean(randomizeSeed),
      Number.isFinite(width) ? width : 1024,
      Number.isFinite(height) ? height : 1024,
      Number.isFinite(guidanceScale) ? guidanceScale : 0,
      Number.isFinite(steps) ? steps : 2,
    ],
  };

  onStatusChange?.("starting");

  let startResp: StartResp;
  try {
    startResp = await startJob(payload);
  } catch {
    throw new Error("Unable to reach Hugging Face. Please try again.");
  }

  if (!startResp.ok) {
    throw new Error(startResp.error || "Failed to start Hugging Face generation.");
  }

  onStatusChange?.("polling");

  const startAt = Date.now();
  while (Date.now() - startAt < timeoutMs) {
    let pollResp: PollResp;
    try {
      pollResp = await pollJob(startResp.eventId);
    } catch {
      throw new Error("Unable to reach Hugging Face. Please try again.");
    }

    if (!pollResp.ok) {
      throw new Error(pollResp.error || "Hugging Face polling failed.");
    }

    if (pollResp.done) {
      if (typeof pollResp.imageUrl === "string" && pollResp.imageUrl) {
        return pollResp.imageUrl;
      }
      throw new Error("Hugging Face returned an invalid image URL.");
    }

    await delay(pollIntervalMs);
  }

  throw new Error("Generation timed out — please try again.");
}

function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}
