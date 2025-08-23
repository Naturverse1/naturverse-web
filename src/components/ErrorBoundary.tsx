import React from "react";

type State = { hasError: boolean; error?: Error };

export default class ErrorBoundary extends React.Component<React.PropsWithChildren, State> {
  state: State = { hasError: false };
  static getDerivedStateFromError(error: Error): State { return { hasError: true, error }; }
  componentDidCatch() { /* no-op (could log later) */ }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ maxWidth: 760, margin: "40px auto", padding: 16 }}>
          <h1>Something went wrong</h1>
          <p className="muted">Try going back home and reloading this page.</p>
          <a className="button" href="/">← Back to Home</a>
        </div>
      );
    }
    return this.props.children;
  }
}
