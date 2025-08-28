import React from "react";
import ErrorFallback from "./ErrorFallback";

/**
 * A classic React error boundary that catches render errors anywhere below it.
 * This prevents “blank white screen” and shows a helpful crash UI instead.
 */
export class GlobalErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { error: unknown }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: unknown) {
    return { error };
  }

  componentDidCatch(error: unknown, errorInfo: unknown) {
    // Best-effort logging — visible in browser console & any log pipeline
    // (Your build already includes a runtime logger; this complements it.)
    // eslint-disable-next-line no-console
    console.error("[naturverse] Uncaught render error", error, errorInfo);
  }

  render() {
    if (this.state.error) {
      return (
        <ErrorFallback
          error={this.state.error}
          onRetry={() => this.setState({ error: null })}
        />
      );
    }
    return this.props.children;
  }
}
