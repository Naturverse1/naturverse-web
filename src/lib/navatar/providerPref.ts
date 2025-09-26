export type Provider =
  | "auto"
  | "openai"
  | "stability"
  | "deepai"
  | "huggingface"
  | "multiavatar";

const KEY = "nv.navatar.provider";

export const getProviderPref = (): Provider => {
  if (typeof localStorage === "undefined") return "auto";
  const stored = localStorage.getItem(KEY) as Provider | null;
  return stored ?? "auto";
};

export const setProviderPref = (provider: Provider) => {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(KEY, provider);
};

export const PROVIDER_LABEL: Record<Provider, string> = {
  auto: "Auto (OpenAI → Stability → DeepAI → HF → Basic)",
  openai: "OpenAI",
  stability: "Stability",
  deepai: "DeepAI",
  huggingface: "Hugging Face",
  multiavatar: "Basic (Multiavatar)",
};
