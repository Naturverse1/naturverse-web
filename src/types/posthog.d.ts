declare module 'posthog-js' {
  type PostHogProperties = Record<string, unknown>;
  export interface PostHog {
    capture(event: string, properties?: PostHogProperties): void;
    identify(distinctId: string, properties?: PostHogProperties): void;
    reset(): void;
    init(key: string, options?: Record<string, unknown>): void;
  }
  const posthog: PostHog;
  export default posthog;
}

declare module 'posthog-js/react' {
  import type { ReactNode } from 'react';
  import type { PostHog } from 'posthog-js';

  export interface PostHogProviderProps {
    client?: PostHog;
    apiKey?: string;
    options?: Record<string, unknown>;
    children?: ReactNode;
  }

  export const PostHogProvider: React.ComponentType<PostHogProviderProps>;
}
