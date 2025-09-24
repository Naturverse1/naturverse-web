import posthog from 'posthog-js';

export function track(event: string, props?: Record<string, any>) {
  try {
    if (posthog?.capture) {
      posthog.capture(event, props);
    }
  } catch {}
}
