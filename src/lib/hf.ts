export type HfGenerateReq = {
  prompt: string;
  width?: number;
  height?: number;
  seed?: number;
};

export type HfGenerateRes = {
  ok: boolean;
  dataUrl: string;
  mime: string;
};

export async function generateViaHF(payload: HfGenerateReq): Promise<HfGenerateRes> {
  const response = await fetch("/api/hf-generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const json = await response.json();
  if (!response.ok) {
    throw new Error(json?.error || "HF API failed");
  }

  return json as HfGenerateRes;
}
