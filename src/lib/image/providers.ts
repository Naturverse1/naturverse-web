export type Provider = "openai" | "huggingface" | "stability" | "deepai";

const STORAGE_KEY = "navatar:provider";
const PROVIDERS: Provider[] = ["openai", "huggingface", "stability", "deepai"];

export function getSelectedProvider(): Provider {
  const v = (localStorage.getItem(STORAGE_KEY) || "").toLowerCase();
  if (PROVIDERS.includes(v as Provider)) {
    return v as Provider;
  }
  return "openai";
}

export function setSelectedProvider(p: Provider) {
  localStorage.setItem(STORAGE_KEY, p);
}

export function listProviders(): Provider[] {
  return [...PROVIDERS];
}
