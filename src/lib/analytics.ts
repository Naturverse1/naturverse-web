export function track(event: string, props?: Record<string, any>) {
  try {
    console.log('[track]', event, props);
  } catch {
    // ignore
  }
}
