export function logEvent(event: string, meta?: Record<string, unknown>) {
  // eslint-disable-next-line no-console
  console.info("[Telemetry]", event, meta);
}
