import type { Provider } from "../navatar/generateClient";

export type ProviderOption = { id: Provider; label: string };

const ACTIVE_PROVIDERS: ProviderOption[] = [
  { id: "huggingface", label: "HUGGINGFACE" },
];

export function listProviders(): ProviderOption[] {
  return ACTIVE_PROVIDERS;
}

export function getSelectedProvider(candidate?: string | null): Provider {
  if (candidate) {
    const normalized = candidate.toLowerCase() as Provider;
    if (ACTIVE_PROVIDERS.some((p) => p.id === normalized)) {
      return normalized;
    }
  }

  return "huggingface";
}
