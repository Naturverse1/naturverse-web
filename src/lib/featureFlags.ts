export const flags = {
  stability: (import.meta.env.VITE_STABILITY_ENABLED ?? 'false') === 'true',
  prelaunch: (import.meta.env.VITE_KICKSTARTER_PRELAUNCH ?? 'true') === 'true',
};

export const analyticsCfg = {
  posthogKey: import.meta.env.VITE_POSTHOG_KEY || '',
  posthogHost: import.meta.env.VITE_POSTHOG_HOST || 'https://app.posthog.com',
  sentryDsn: import.meta.env.VITE_SENTRY_DSN || '',
};
