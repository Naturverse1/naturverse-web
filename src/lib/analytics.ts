export function track(event: string, props?: Record<string, any>) {
  // Send to Umami if available, fall back to console logging
  try {
    // @ts-ignore
    (window as any)?.umami?.track?.(event, props);
  } catch {
    // ignore failures accessing window
  }
  try {
    console.log("[track]", event, props);
  } catch {
    // swallow logging errors
  }
}
