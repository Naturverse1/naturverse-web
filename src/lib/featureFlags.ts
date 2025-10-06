export const flags = {
  stability: (import.meta.env.VITE_STABILITY_ENABLED ?? 'false') === 'true',
  prelaunch: (import.meta.env.VITE_KICKSTARTER_PRELAUNCH ?? 'true') === 'true',
};

export const analyticsCfg = {
  posthogKey: import.meta.env.VITE_PUBLIC_POSTHOG_KEY || '',
  posthogHost: import.meta.env.VITE_PUBLIC_POSTHOG_HOST || '',
  sentryDsn: import.meta.env.VITE_SENTRY_DSN || '',
};
