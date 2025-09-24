import { supabase } from './supabaseClient';
import { analyticsCfg } from './featureFlags';

type AnalyticsEvent = {
  event: string;
  from_page?: string | null;
  to_page?: string | null;
  text?: string | null;
};

export async function logEvent(payload: AnalyticsEvent) {
  try {
    await supabase.from('analytics').insert({
      event: payload.event,
      from_page: payload.from_page ?? null,
      to_page: payload.to_page ?? null,
      text: payload.text ?? null,
    });
  } catch (e) {
    // non-blocking: never break UX if logging fails
    console.warn('analytics log failed', e);
  }
}

// PostHog minimal capture helper (no-op when keys missing)
export function track(ev: string, props?: Record<string, any>) {
  if (!analyticsCfg.posthogKey) return;
  try {
    (window as any).posthog?.capture(ev, props);
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn('posthog capture failed', error);
    }
  }
}

