export type AvatarProvider = 'dicebear' | 'deepai';

function deepAiFlagEnabled() {
  const flag =
    (import.meta.env.VITE_NAVATAR_ENABLE_DEEPAI as string | undefined) ??
    (import.meta.env.NAVATAR_ENABLE_DEEPAI as string | undefined);
  return flag === 'true';
}

export function providersEnabled(): AvatarProvider[] {
  const list: AvatarProvider[] = ['dicebear'];
  if (deepAiFlagEnabled()) {
    list.push('deepai');
  }
  return list;
}

export function isDeepAiEnabled(): boolean {
  return providersEnabled().includes('deepai');
}
