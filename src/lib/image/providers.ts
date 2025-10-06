export type Provider = "openai" | "stability" | "huggingface" | "deepai" | "multavatar";

const STORAGE_KEY = "navatar:provider";
const DEFAULT_PROVIDER: Provider = "openai";

const META: Record<Provider, { label: string; endpoint: string }> = {
  openai: { label: "OpenAI", endpoint: "/.netlify/functions/image-openai" },
  stability: { label: "Stability AI", endpoint: "/.netlify/functions/image-stability" },
  huggingface: { label: "Hugging Face", endpoint: "/.netlify/functions/image-huggingface" },
  deepai: { label: "DeepAI", endpoint: "/.netlify/functions/image-deepai" },
  multavatar: { label: "Multavatar", endpoint: "/.netlify/functions/image-multavatar" },
};

const ORDER: Provider[] = ["openai", "stability", "huggingface", "deepai", "multavatar"];

export type ProviderOption = {
  id: Provider;
  label: string;
};

export function listProviders(): ProviderOption[] {
  return ORDER.map((id) => ({ id, label: META[id].label }));
}

export function providerLabel(provider: Provider) {
  return META[provider]?.label ?? provider;
}

export function providerEndpoint(provider: Provider) {
  return META[provider]?.endpoint ?? META[DEFAULT_PROVIDER].endpoint;
}

export function getSelectedProvider(): Provider {
  if (typeof window === "undefined") {
    return DEFAULT_PROVIDER;
  }
  const stored = (window.localStorage.getItem(STORAGE_KEY) || "").toLowerCase();
  return isProvider(stored) ? stored : DEFAULT_PROVIDER;
}

export function setSelectedProvider(provider: Provider) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, provider);
}

function isProvider(value: string): value is Provider {
  return (ORDER as readonly string[]).includes(value);
}
