import React from "react";

type State = { hasError: boolean; err?: unknown };

export default class ErrorBoundary extends React.Component<React.PropsWithChildren, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(err: unknown) {
    return { hasError: true, err };
  }

  componentDidCatch(error: unknown, info: unknown) {
    // no-op; could log to Supabase later
    void error; void info;
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="page-wrap" style={{ paddingTop: 24 }}>
          <h1>Something went wrong</h1>
          <p className="muted">Try refreshing, or head back home.</p>
          <a className="btn" href="/">Back to Home</a>
        </div>
      );
    }
    return this.props.children;
  }
}
