import { createElement } from 'react';
import type { ComponentType, ReactNode } from 'react';
import { supabase } from './supabaseClient';
import { analyticsCfg } from './featureFlags';

type RenderFn = (children: ReactNode) => void;

const schedule = (callback: () => void) => {
  if (typeof window === 'undefined') {
    return;
  }

  const idle = (window as typeof window & { requestIdleCallback?: (cb: () => void) => void })
    .requestIdleCallback;

  if (typeof idle === 'function') {
    idle(callback);
    return;
  }

  window.setTimeout(callback, 50);
};

export const initPostHogIfEnabled = (render: RenderFn, app: ReactNode) => {
  const apiKey = import.meta.env.VITE_PUBLIC_POSTHOG_KEY;
  const apiHost = import.meta.env.VITE_PUBLIC_POSTHOG_HOST;

  if (!apiKey || !apiHost) {
    return;
  }

  const mount = async () => {
    try {
      const moduleName = 'posthog-js/react';
      const module = (await import(/* @vite-ignore */ moduleName)) as {
        PostHogProvider?: ComponentType<{ apiKey: string; options: { api_host: string } }>;
      };

      const PostHogProvider = module.PostHogProvider;

      if (!PostHogProvider) {
        return;
      }

      render(
        createElement(
          PostHogProvider,
          { apiKey, options: { api_host: apiHost } },
          app,
        ),
      );
    } catch (error) {
      if (import.meta.env.DEV) {
        console.warn('PostHog analytics unavailable. Continuing without analytics.', error);
      }
    }
  };

  schedule(() => {
    void mount();
  });
};

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
